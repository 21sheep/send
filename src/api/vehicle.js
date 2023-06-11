import createAPI from '@/utils/request.js'

//  获取车辆分页数据
export const getVehiclePage = (params) => createAPI('/truck/page', 'get', params)

//  获取车辆信息列表
export const getCarInfoList = () => createAPI('/truckType/simple', 'get')

//   新增车辆
export const addCar = (carForm) => createAPI('/truck', 'post', carForm)

//  启用车辆
export const enableCar = (id) => createAPI(`/enable/${id}`, 'put')

//  获取单个车辆信息
export const getCarDetail = (id) => createAPI(`/truck/${id}`, 'get')

//  获取已经停用的车辆
export const getUnWorkingCar = () => createAPI('/unWorkingTrucks', 'get')

//  获取已经启用的车辆
export const getWorkingCar = () => createAPI('/workingTrucks', 'get')

