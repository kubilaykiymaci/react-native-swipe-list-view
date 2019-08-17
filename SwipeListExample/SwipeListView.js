// @flow

import * as React from "react"
import { FlatList, Platform, SectionList } from "react-native"
import SwipeRow from "./SwipeRow"
import { styles } from "./assets/styles"

type PropsType = {
  useSectionList?: boolean,
  className?: Object,
  renderItem: Function,
  renderHiddenItem: Function,
  leftOpenValue: number,
  rightOpenValue: number,
  stopLeftSwipe?: number,
  stopRightSwipe?: number,
  closeOnScroll: boolean,
  closeOnRowPress: boolean,
  closeOnRowBeginSwipe: boolean,
  closeOnRowOpen?: boolean,
  disableLeftSwipe: boolean,
  disableRightSwipe: boolean,
  recalculateHiddenLayout: boolean,
  disableHiddenLayoutCalculation: boolean,
  swipeGestureBegan?: Function,
  onRowOpen?: Function,
  onRowDidOpen?: Function,
  onRowClose?: Function,
  onRowDidClose?: Function,
  onScrollEnabled?: Function,
  swipeRowStyle?: Object,
  listViewRef?: Function,
  previewRowKey: string,
  previewFirstRow: boolean,
  previewDuration?: number,
  previewOpenDelay: number,
  previewOpenValue: number,
  friction?: number,
  tension?: number,
  directionalDistanceChangeThreshold: number,
  swipeToOpenPercent: number,
  swipeToOpenVelocityContribution: number,
  swipeToClosePercent: number,
  shouldItemUpdate?: Function,
  onSwipeValueChange?: Function,
  useNativeDriver: boolean,
  renderHiddenRow?: Function,
  keyExtractor?: any,
  scrollEnabled?: boolean,
  onScroll?: Function,
  onLayout?: Function,
  onContentSizeChange?: Function
}
class SwipeListView extends React.Component<PropsType> {
  static defaultProps = {
    leftOpenValue: 0,
    rightOpenValue: 0,
    closeOnRowBeginSwipe: true,
    closeOnScroll: true,
    closeOnRowPress: false,
    closeOnRowOpen: true,
    disableLeftSwipe: false,
    disableRightSwipe: true,
    recalculateHiddenLayout: false,
    disableHiddenLayoutCalculation: false,
    previewFirstRow: false,
    directionalDistanceChangeThreshold: 2,
    swipeToOpenPercent: 25,
    swipeToOpenVelocityContribution: 0,
    swipeToClosePercent: 25,
    useNativeDriver: false
  }
  _rows: Object
  openCellKey: any
  _listView: Object
  listViewProps: Object
  yScrollOffset: ?number
  layoutHeight: ?number
  constructor(props: PropsType) {
    super(props)
    this._rows = {}
    this.openCellKey = null
    this.listViewProps = {}
    if (Platform.OS === "ios") {
      // Keep track of scroll offset and layout changes on iOS to be able to handle
      // https://github.com/jemise111/react-native-swipe-list-view/issues/109
      this.yScrollOffset = 0
      this.layoutHeight = 0
      this.listViewProps = {
        onLayout: (e: any): void => this.onLayout(e),
        onContentSizeChange: (w: number, h: number): void => this.onContentSizeChange(w, h)
      }
    }
  }
  setScrollEnabled(enable: boolean): any {
    const { scrollEnabled, onScrollEnabled } = this.props
    if (scrollEnabled === false) {
      return
    }
    // Due to multiple issues reported across different versions of RN
    // We do this in the safest way possible...
    if (this._listView && this._listView.setNativeProps) {
      this._listView.setNativeProps({ scrollEnabled: enable })
    } else if (this._listView && this._listView.getScrollResponder) {
      const scrollResponder = this._listView.getScrollResponder()
      scrollResponder.setNativeProps && scrollResponder.setNativeProps({ scrollEnabled: enable })
    }
    onScrollEnabled && onScrollEnabled(enable)
  }
  safeCloseOpenRow() {
    const rowRef = this._rows[this.openCellKey]
    if (rowRef && rowRef.closeRow) {
      this._rows[this.openCellKey].closeRow()
    }
  }
  rowSwipeGestureBegan(key: number | string) {
    const { closeOnRowBeginSwipe, swipeGestureBegan } = this.props
    if (closeOnRowBeginSwipe && this.openCellKey && this.openCellKey !== key) {
      this.safeCloseOpenRow()
    }
    if (swipeGestureBegan) {
      swipeGestureBegan(key)
    }
  }
  onRowOpen(key: number | string, toValue: any) {
    const { closeOnRowOpen, closeOnRowBeginSwipe, onRowOpen } = this.props
    if (this.openCellKey && this.openCellKey !== key && closeOnRowOpen && !closeOnRowBeginSwipe) {
      this.safeCloseOpenRow()
    }
    this.openCellKey = key
    onRowOpen && onRowOpen(key, this._rows, toValue)
  }
  onRowPress() {
    const { closeOnRowPress } = this.props
    if (this.openCellKey) {
      if (closeOnRowPress) {
        this.safeCloseOpenRow()
        this.openCellKey = null
      }
    }
  }
  onScroll(e: any) {
    const { closeOnScroll, onScroll } = this.props
    if (Platform.OS === "ios") {
      this.yScrollOffset = e.nativeEvent.contentOffset.y
    }
    if (this.openCellKey) {
      if (closeOnScroll) {
        this.safeCloseOpenRow()
        this.openCellKey = null
      }
    }
    onScroll && onScroll(e)
  }
  onLayout(e: any) {
    const { onLayout } = this.props
    this.layoutHeight = e.nativeEvent.layout.height
    onLayout && onLayout(e)
  }
  // See: https://github.com/jemise111/react-native-swipe-list-view/issues/109
  onContentSizeChange(w: number, h: number) {
    const { onContentSizeChange } = this.props
    const height = this.layoutHeight ? h - this.layoutHeight : h
    if (this.yScrollOffset) {
      if (this.yScrollOffset >= height && height > 0) {
        if (this._listView instanceof FlatList) {
          this._listView && this._listView.scrollToEnd()
        }
      }
    }
    onContentSizeChange && onContentSizeChange(w, h)
  }
  setRefs(ref: any) {
    const { listViewRef } = this.props
    this._listView = ref
    listViewRef && listViewRef(ref)
  }
  renderCell(
    VisibleComponent: any,
    HiddenComponent: React.Node,
    key: string | number,
    item: any,
    shouldPreviewRow: any
  ): any {
    const {
      onRowDidOpen,
      onRowClose,
      onRowDidClose,
      onSwipeValueChange,
      shouldItemUpdate,
      leftOpenValue,
      rightOpenValue,
      closeOnRowPress,
      disableLeftSwipe,
      disableRightSwipe,
      stopLeftSwipe,
      stopRightSwipe,
      recalculateHiddenLayout,
      disableHiddenLayoutCalculation,
      swipeRowStyle,
      previewDuration,
      previewOpenDelay,
      previewOpenValue,
      tension,
      friction,
      directionalDistanceChangeThreshold,
      swipeToOpenPercent,
      swipeToOpenVelocityContribution,
      swipeToClosePercent,
      useNativeDriver
    } = this.props
    if (!HiddenComponent) {
      return React.cloneElement(VisibleComponent, {
        ...VisibleComponent.props,
        ref: (row: any): void => (this._rows[key] = row),
        onRowOpen: (toValue: any): void => this.onRowOpen(key, toValue),
        onRowDidOpen: (toValue: any): void =>
          onRowDidOpen && onRowDidOpen(key, this._rows, toValue),
        onRowClose: (_: any): void => onRowClose && onRowClose(key, this._rows),
        onRowDidClose: (_: any): void => onRowDidClose && onRowDidClose(key, this._rows),
        onRowPress: (_: any): void => this.onRowPress(),
        setScrollEnabled: (enable: boolean): void => this.setScrollEnabled(enable),
        swipeGestureBegan: (_: any): void => this.rowSwipeGestureBegan(key)
      })
    } else {
      return (
        <SwipeRow
          onSwipeValueChange={
            onSwipeValueChange
              ? (data: any): void => onSwipeValueChange && onSwipeValueChange({ ...data, key })
              : null
          }
          ref={(row: any): void => (this._rows[key] = row)}
          swipeGestureBegan={(_: any): void => this.rowSwipeGestureBegan(key)}
          onRowOpen={(toValue: any): void => this.onRowOpen(key, toValue)}
          onRowDidOpen={(toValue: any): void =>
            onRowDidOpen && onRowDidOpen(key, this._rows, toValue)
          }
          onRowClose={(_: any): void => onRowClose && onRowClose(key, this._rows)}
          onRowDidClose={(_: any): void => onRowDidClose && onRowDidClose(key, this._rows)}
          onRowPress={(_: any): void => this.onRowPress()}
          shouldItemUpdate={
            shouldItemUpdate
              ? (currentItem: any, newItem: any): void =>
                  shouldItemUpdate && shouldItemUpdate(currentItem, newItem)
              : null
          }
          setScrollEnabled={(enable: boolean): void => this.setScrollEnabled(enable)}
          leftOpenValue={item.leftOpenValue || leftOpenValue}
          rightOpenValue={item.rightOpenValue || rightOpenValue}
          closeOnRowPress={item.closeOnRowPress || closeOnRowPress}
          disableLeftSwipe={item.disableLeftSwipe || disableLeftSwipe}
          disableRightSwipe={item.disableRightSwipe || disableRightSwipe}
          stopLeftSwipe={item.stopLeftSwipe || stopLeftSwipe}
          stopRightSwipe={item.stopRightSwipe || stopRightSwipe}
          recalculateHiddenLayout={recalculateHiddenLayout}
          disableHiddenLayoutCalculation={disableHiddenLayoutCalculation}
          style={swipeRowStyle}
          preview={shouldPreviewRow}
          previewDuration={previewDuration}
          previewOpenDelay={previewOpenDelay}
          previewOpenValue={previewOpenValue}
          tension={tension}
          friction={friction}
          directionalDistanceChangeThreshold={directionalDistanceChangeThreshold}
          swipeToOpenPercent={swipeToOpenPercent}
          swipeToOpenVelocityContribution={swipeToOpenVelocityContribution}
          swipeToClosePercent={swipeToClosePercent}
          item={item} // used for should item update comparisons
          useNativeDriver={useNativeDriver}
        >
          {HiddenComponent}
          {VisibleComponent}
        </SwipeRow>
      )
    }
  }

  renderItem = (rowData: any, rowMap: any): any => {
    const { renderItem, renderHiddenItem, keyExtractor, previewRowKey } = this.props
    const Component = renderItem(rowData, rowMap)
    const HiddenComponent = renderHiddenItem && renderHiddenItem(rowData, rowMap)
    let { item, index } = rowData
    let { key } = item
    if (!key && keyExtractor) {
      key = keyExtractor(item, index)
    }
    const shouldPreviewRow = typeof key !== "undefined" && previewRowKey === key
    return this.renderCell(Component, HiddenComponent, key, item, shouldPreviewRow)
  }

  render(): React.Node {
    const { useSectionList, className, ...props } = this.props
    const flatListStyle = className ? className.flatListStyle : null
    const sectionListStyle = className ? className.sectionListStyle : null
    if (useSectionList) {
      return (
        <SectionList
          style={[styles.sectionListContainer, sectionListStyle]}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item: any, index: number): number => index}
          {...props}
          {...this.listViewProps}
          ref={(c: any): any => this.setRefs(c)}
          onScroll={(e: any): void => this.onScroll(e)}
          renderItem={(rowData: any): any => this.renderItem(rowData, this._rows)}
        />
      )
    }
    return (
      <FlatList
        style={[styles.flatListContainer, flatListStyle]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        keyExtractor={(item: any, index: number): number => index}
        {...props}
        {...this.listViewProps}
        ref={(c: any): any => this.setRefs(c)}
        onScroll={(e: any): void => this.onScroll(e)}
        renderItem={(rowData: any): void => this.renderItem(rowData, this._rows)}
      />
    )
  }
}
export default SwipeListView
