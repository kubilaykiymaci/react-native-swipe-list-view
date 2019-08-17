// @flow
import * as React from "react"
import {
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  ViewPropTypes,
  View
} from "react-native"
import { styles } from "./assets/styles"
const DEFAULT_PREVIEW_OPEN_DELAY = 700
const PREVIEW_CLOSE_DELAY = 300
const MAX_VELOCITY_CONTRIBUTION = 5
const SCROLL_LOCK_MILLISECONDS = 300
const ROW_CONTENT_ZINDEX = 2
type PropsType = {
  style?: ViewPropTypes.style,
  useNativeDriver: boolean,
  children?: any,
  item: any,
  leftOpenValue: number,
  rightOpenValue: number,
  closeOnRowPress: boolean,
  disableLeftSwipe: boolean,
  disableRightSwipe: boolean,
  recalculateHiddenLayout: boolean,
  disableHiddenLayoutCalculation: boolean,
  preview: boolean,
  previewDuration: number,
  previewOpenValue: number,
  previewOpenDelay: number,
  directionalDistanceChangeThreshold: number,
  swipeToOpenPercent: number,
  swipeToOpenVelocityContribution: number,
  swipeToClosePercent: number,
  forceCloseToLeftThreshold?: number,
  forceCloseToRightThreshold?: number,
  stopLeftSwipe?: number,
  stopRightSwipe?: number,
  friction?: number,
  tension?: number,
  shouldItemUpdate: Function,
  onSwipeValueChange: Function,
  onForceCloseToLeft?: Function,
  onForceCloseToRight?: Function,
  onForceCloseToLeftEnd?: Function,
  onForceCloseToRightEnd?: Function,
  setScrollEnabled?: Function,
  swipeGestureBegan?: Function,
  onRowOpen?: Function,
  onRowDidOpen?: Function,
  onRowPress?: Function,
  onRowClose?: Function,
  onRowDidClose?: Function
}
type StateType = {
  dimensionsSet: boolean,
  hiddenHeight: string | number,
  hiddenWidth: string | number
}
class SwipeRow extends React.Component<PropsType, StateType> {
  static defaultProps = {
    leftOpenValue: 0,
    rightOpenValue: 0,
    closeOnRowPress: true,
    disableLeftSwipe: false,
    disableRightSwipe: false,
    recalculateHiddenLayout: false,
    disableHiddenLayoutCalculation: false,
    preview: false,
    previewDuration: 300,
    previewOpenDelay: DEFAULT_PREVIEW_OPEN_DELAY,
    directionalDistanceChangeThreshold: 2,
    swipeToOpenPercent: 50,
    swipeToOpenVelocityContribution: 0,
    swipeToClosePercent: 50,
    item: {},
    useNativeDriver: true
  }
  isOpen: boolean = false
  previousTrackedTranslateX: number
  previousTrackedDirection: ?any
  horizontalSwipeGestureBegan: boolean
  swipeInitialX: ?any
  parentScrollEnabled: boolean
  ranPreview: boolean
  _ensureScrollEnabledTimer: any
  isForceClosing: boolean
  _translateX: any
  _panResponder: any
  constructor(props: PropsType) {
    super(props)
    this.isOpen = false
    this.previousTrackedTranslateX = 0
    this.previousTrackedDirection = null
    this.horizontalSwipeGestureBegan = false
    this.swipeInitialX = null
    this.parentScrollEnabled = true
    this.ranPreview = false
    this._ensureScrollEnabledTimer = null
    this.isForceClosing = false
    this.state = {
      dimensionsSet: false,
      hiddenHeight: props.disableHiddenLayoutCalculation ? "100%" : 0,
      hiddenWidth: props.disableHiddenLayoutCalculation ? "100%" : 0
    }
    this._translateX = new Animated.Value(0)
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e: any, gs: any): any =>
        this.handleOnMoveShouldSetPanResponder(e, gs),
      onPanResponderMove: (e: any, gs: any): any => this.handlePanResponderMove(e, gs),
      onPanResponderRelease: (e: any, gs: any): any => this.handlePanResponderEnd(e, gs),
      onPanResponderTerminate: (e: any, gs: any): any => this.handlePanResponderEnd(e, gs),
      onShouldBlockNativeResponder: (_: any): boolean => false
    })
    if (props.onSwipeValueChange) {
      this._translateX.addListener(({ value }: Object) => {
        let direction = this.previousTrackedDirection
        if (value !== this.previousTrackedTranslateX) {
          direction = value > this.previousTrackedTranslateX ? "right" : "left"
        }
        props.onSwipeValueChange &&
          props.onSwipeValueChange({
            isOpen: this.isOpen,
            direction,
            value
          })
        this.previousTrackedTranslateX = value
        this.previousTrackedDirection = direction
      })
    }
    if (props.forceCloseToRightThreshold && props.forceCloseToRightThreshold > 0) {
      this._translateX.addListener(({ value }: Object) => {
        if (
          !this.isForceClosing &&
          Dimensions.get("window").width + value < props.forceCloseToRightThreshold
        ) {
          this.isForceClosing = true
          this.forceCloseRow("right")
          if (props.onForceCloseToRight) {
            props.onForceCloseToRight()
          }
        }
      })
    }
    if (props.forceCloseToLeftThreshold && props.forceCloseToLeftThreshold > 0) {
      const forceCloseToLeftThreshold = props.forceCloseToLeftThreshold
      this._translateX.addListener(({ value }: Object) => {
        if (
          !this.isForceClosing &&
          Dimensions.get("window").width - value < forceCloseToLeftThreshold
        ) {
          this.isForceClosing = true
          this.forceCloseRow("left")
          if (props.onForceCloseToLeft) {
            props.onForceCloseToLeft()
          }
        }
      })
    }
  }
  componentWillUnmount() {
    clearTimeout(this._ensureScrollEnabledTimer)
    this._translateX.removeAllListeners()
  }
  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    const { hiddenHeight, hiddenWidth } = this.state
    const { shouldItemUpdate, item } = this.props
    if (
      hiddenHeight !== nextState.hiddenHeight ||
      hiddenWidth !== nextState.hiddenWidth ||
      !shouldItemUpdate ||
      (shouldItemUpdate && shouldItemUpdate(item, nextProps.item))
    ) {
      return true
    }
    return false
  }
  getPreviewAnimation(toValue: any, delay: any): any {
    const { previewDuration, useNativeDriver } = this.props
    return Animated.timing(this._translateX, {
      duration: previewDuration,
      toValue,
      delay,
      useNativeDriver: useNativeDriver
    })
  }
  onContentLayout(e: any) {
    const {
      recalculateHiddenLayout,
      disableHiddenLayoutCalculation,
      preview,
      previewOpenValue,
      rightOpenValue,
      previewOpenDelay
    } = this.props
    this.setState({
      dimensionsSet: !recalculateHiddenLayout,
      ...(!disableHiddenLayoutCalculation
        ? {
            hiddenHeight: e.nativeEvent.layout.height,
            hiddenWidth: e.nativeEvent.layout.width
          }
        : {})
    })
    if (preview && !this.ranPreview) {
      this.ranPreview = true
      let previewOpenVal = previewOpenValue || rightOpenValue * 0.5
      this.getPreviewAnimation(previewOpenVal, previewOpenDelay).start((_: any): any => {
        this.getPreviewAnimation(0, PREVIEW_CLOSE_DELAY).start()
      })
    }
  }
  onRowPress() {
    const { onRowPress, closeOnRowPress } = this.props
    if (onRowPress) {
      onRowPress()
    } else {
      if (closeOnRowPress) {
        this.closeRow()
      }
    }
  }
  handleOnMoveShouldSetPanResponder(e: any, gs: any): any {
    const { dx } = gs
    const { directionalDistanceChangeThreshold } = this.props
    return Math.abs(dx) > directionalDistanceChangeThreshold
  }
  handlePanResponderMove(e: any, gestureState: any): ?any {
    const {
      directionalDistanceChangeThreshold,
      setScrollEnabled,
      swipeGestureBegan,
      disableLeftSwipe,
      disableRightSwipe,
      stopLeftSwipe,
      stopRightSwipe
    } = this.props
    /* If the view is force closing, then ignore Moves. Return */
    if (this.isForceClosing) {
      return
    }
    /* Else, do normal job */
    const { dx, dy } = gestureState
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    // this check may not be necessary because we don't capture the move until we pass the threshold
    // just being extra safe here
    if (absDx > directionalDistanceChangeThreshold || absDy > directionalDistanceChangeThreshold) {
      // we have enough to determine direction
      if (absDy > absDx && !this.horizontalSwipeGestureBegan) {
        // user is moving vertically, do nothing, listView will handle
        return
      }
      // user is moving horizontally
      if (this.parentScrollEnabled) {
        // disable scrolling on the listView parent
        this.parentScrollEnabled = false
        setScrollEnabled && setScrollEnabled(false)
      }
      if (this.swipeInitialX === null) {
        // set tranlateX value when user started swiping
        this.swipeInitialX = this._translateX._value
      }
      if (!this.horizontalSwipeGestureBegan) {
        this.horizontalSwipeGestureBegan = true
        swipeGestureBegan && swipeGestureBegan()
      }
      let newDX = this.swipeInitialX + dx
      if (disableLeftSwipe && newDX < 0) {
        newDX = 0
      }
      if (disableRightSwipe && newDX > 0) {
        newDX = 0
      }
      if (stopLeftSwipe && newDX > stopLeftSwipe) {
        newDX = stopLeftSwipe
      }
      if (stopRightSwipe && newDX < stopRightSwipe) {
        newDX = stopRightSwipe
      }
      this._translateX.setValue(newDX)
    }
  }
  ensureScrollEnabled = () => {
    const { setScrollEnabled } = this.props
    if (!this.parentScrollEnabled) {
      this.parentScrollEnabled = true
      setScrollEnabled && setScrollEnabled(true)
    }
  }
  handlePanResponderEnd(e: any, gestureState: any) {
    /* PandEnd will reset the force-closing state when it's true. */
    if (this.isForceClosing) {
      this.isForceClosing = false
    }
    const {
      swipeToOpenVelocityContribution,
      rightOpenValue,
      leftOpenValue,
      swipeToOpenPercent,
      swipeToClosePercent
    } = this.props
    // decide how much the velocity will affect the final position that the list item settles in.

    const possibleExtraPixels = rightOpenValue * swipeToOpenVelocityContribution
    const clampedVelocity = Math.min(gestureState.vx, MAX_VELOCITY_CONTRIBUTION)
    const projectedExtraPixels = possibleExtraPixels * (clampedVelocity / MAX_VELOCITY_CONTRIBUTION)
    // re-enable scrolling on listView parent
    this._ensureScrollEnabledTimer = setTimeout(this.ensureScrollEnabled, SCROLL_LOCK_MILLISECONDS)
    // finish up the animation
    let toValue = 0
    if (this._translateX._value >= 0) {
      // trying to swipe right
      if (this.swipeInitialX < this._translateX._value) {
        if (
          this._translateX._value - projectedExtraPixels >
          leftOpenValue * (swipeToOpenPercent / 100)
        ) {
          // we're more than halfway
          toValue = leftOpenValue
        }
      } else {
        if (
          this._translateX._value - projectedExtraPixels >
          leftOpenValue * (1 - swipeToClosePercent / 100)
        ) {
          toValue = leftOpenValue
        }
      }
    } else {
      // trying to swipe left
      if (this.swipeInitialX > this._translateX._value) {
        if (
          this._translateX._value - projectedExtraPixels <
          rightOpenValue * (swipeToOpenPercent / 100)
        ) {
          // we're more than halfway
          toValue = rightOpenValue
        }
      } else {
        if (
          this._translateX._value - projectedExtraPixels <
          rightOpenValue * (1 - swipeToClosePercent / 100)
        ) {
          toValue = rightOpenValue
        }
      }
    }
    this.manuallySwipeRow(toValue)
  }
  closeRow() {
    this.manuallySwipeRow(0)
  }
  forceCloseRow(direction: string) {
    const { onForceCloseToRightEnd, onForceCloseToLeftEnd } = this.props
    this.manuallySwipeRow(0, () => {
      if (direction === "right" && onForceCloseToRightEnd) {
        onForceCloseToRightEnd()
      } else if (direction === "left" && onForceCloseToLeftEnd) {
        onForceCloseToLeftEnd()
      }
    })
  }
  closeRowWithoutAnimation() {
    const { onRowDidClose, onRowClose } = this.props
    this._translateX.setValue(0)
    this.ensureScrollEnabled()
    this.isOpen = false
    onRowDidClose && onRowDidClose()
    onRowClose && onRowClose()
    this.swipeInitialX = null
    this.horizontalSwipeGestureBegan = false
  }
  manuallySwipeRow(toValue: any, onAnimationEnd: any) {
    const {
      friction,
      tension,
      useNativeDriver,
      onRowDidClose,
      onRowDidOpen,
      onRowClose,
      onRowOpen
    } = this.props
    Animated.spring(this._translateX, {
      toValue,
      friction: friction,
      tension: tension,
      useNativeDriver: useNativeDriver
    }).start((_: any): any => {
      this.ensureScrollEnabled()
      if (toValue === 0) {
        this.isOpen = false
        onRowDidClose && onRowDidClose()
      } else {
        this.isOpen = true
        onRowDidOpen && onRowDidOpen(toValue)
      }
      if (onAnimationEnd) {
        onAnimationEnd()
      }
    })
    if (toValue === 0) {
      onRowClose && onRowClose()
    } else {
      onRowOpen && onRowOpen(toValue)
    }
    // reset everything
    this.swipeInitialX = null
    this.horizontalSwipeGestureBegan = false
  }
  renderVisibleContent(): ?React.Node {
    const { children } = this.props
    // handle touchables
    const onPress = children ? children[1].props.onPress : null
    if (onPress) {
      const newOnPress = (...args: any): any => {
        this.onRowPress()
        onPress(...args)
      }
      if (children) {
        return React.cloneElement(children[1], {
          ...children[1].props,
          onPress: newOnPress
        })
      } else {
        return null
      }
    }
    if (children) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={(_: any): any => this.onRowPress()}>
          {children[1]}
        </TouchableOpacity>
      )
    }
  }
  renderRowContent(): React.Node {
    // We do this annoying if statement for performance.
    // We don't want the onLayout func to run after it runs once.
    const { dimensionsSet } = this.state
    if (dimensionsSet) {
      return (
        <Animated.View
          manipulationModes={["translateX"]}
          {...this._panResponder.panHandlers}
          style={{
            zIndex: ROW_CONTENT_ZINDEX,
            transform: [{ translateX: this._translateX }]
          }}
        >
          {this.renderVisibleContent()}
        </Animated.View>
      )
    } else {
      return (
        <Animated.View
          manipulationModes={["translateX"]}
          {...this._panResponder.panHandlers}
          onLayout={(e: any): any => this.onContentLayout(e)}
          style={{
            zIndex: ROW_CONTENT_ZINDEX,
            transform: [{ translateX: this._translateX }]
          }}
        >
          {this.renderVisibleContent()}
        </Animated.View>
      )
    }
  }
  render(): React.Node {
    const { style, children } = this.props
    const { hiddenHeight, hiddenWidth } = this.state
    return (
      <View style={style ? style : {}}>
        <View
          style={[
            styles.hidden,
            {
              height: hiddenHeight,
              width: hiddenWidth
            }
          ]}
        >
          {children ? children[0] : null}
        </View>
        {this.renderRowContent()}
      </View>
    )
  }
}

export default SwipeRow
