import axiosClient from "../axiosClient";

const baseTask = "tasks"

export const createRoomTask = async(roomId,data)=>{
    console.log(data)
    
    return axiosClient.post(`/${baseTask}/${roomId}`,data)
}
  
export const deleteRoomTask = async(roomId,taskId)=>{
    console.log(roomId,taskId)
    // return
    const res = await axiosClient.delete(`/${baseTask}/${taskId}/${roomId}`)
    console.log(res)
    return res
}

export const createSwitchRequest = async(roomId,taskId,data)=>{
    return axiosClient.post(`/${baseTask}/taskSwitch/${taskId}/${roomId}`,data)
}

export const createSwitchResponse = async(roomId,taskId,data)=>{
    return axiosClient.post(`/${baseTask}/taskSwitchResponse/${taskId}/${roomId}`,data)
}
