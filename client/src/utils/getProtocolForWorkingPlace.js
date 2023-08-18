import axios from 'axios'
export const getProtocol = async (idProtocols) => {
    const getOption = {
        method: 'get',
        url: `/scale_protocol/${idProtocols}`,
        headers: { 'Content-Type': 'application/json' },
    }
    const { data } = await axios(getOption).catch(console.error)
    if (data){
        return data
    } else {
        return false
    }
}