import '@/utils/http'
type Data<T> = {
  code: number
  msg: string
  result: T
  data: T
}

export const uploadFileAPI = (filePath: string) => {
  return new Promise<Data<{ url: string }>>((resolve, reject) => {
    uni.uploadFile({
      url: '/api/uploads',
      filePath,
      name: 'file',
      success: (res) => {
        try {
          if (!(res.statusCode >= 200 && res.statusCode < 300)) {
            return reject(res)
          }
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          resolve(data as Data<{ url: string }>)
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
