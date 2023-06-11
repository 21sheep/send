/*
 * @Author: zhangyanxin
 * @Date: 2020-02-20
 *
 * 订单管理
 */

import { createAPI } from '@/utils/request'

// 获取订单分页数据
export const orderList = data => createAPI(`/order-manager/order/page`, 'post', data)
// 获取订单详情数据
export const orderDetail = id => createAPI(`/order-manager/order/${id}`, 'get')
// 更新订单
export const updateOrder = (id, data) => createAPI(`/order-manager/order/${id}`, 'post', data)
// 获取订单轨迹
export const getOrderTrackApi = (id) => createAPI(`transport-order-manager/track/${id}`, 'get')
// 获取地址
export const getWhere = data => createAPI(`/areas/children`, 'get', data)
// 获取货物类型
export const getGoodsType = data => createAPI(`/goodsType/simple`, 'get', data)
// 更新货物信息
export const updateGoods = (id, data) => createAPI(`/order-manager/cargo/${id}`, 'put', data)
// 删除货物信息
export const delGoods = (id) => createAPI(`/order-manager/cargo/${id}`, 'get')

