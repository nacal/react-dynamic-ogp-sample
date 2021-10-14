import { useEffect, useState } from "react"
// import { withRouter } from 'react-router'
import { useHistory } from "react-router-dom"
import { API, graphqlOperation, Storage, Auth } from "aws-amplify"
import { listImages } from '../graphql/queries'
import { createImage } from '../graphql/mutations'
import AWS from 'aws-sdk'

export const Top = () => {
  const history = useHistory();
  const [images, setImages] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState({})

  const getImage = async () => {
    const res = await API.graphql(graphqlOperation(listImages))
    const images = res.data.listImages.items
    for (var i in images) {
      images[i].path = await Storage.get(images[i].path)
    }
    setImages(images)
  }

  useEffect(() => {
    getImage()
  }, [])

  const handleToDetailPage = (id) => {
    history.push(`/detail/${id}`)
  }
  const registerImage = async () => {
    if (!name || !description || !file.name) {
      return
    }
    // 画像情報取得
    const mimeType = file.type;
    const { width, height } = await loadImage(file)
    // 画像情報保存
    await API.graphql(graphqlOperation(createImage, { input: {
      path: file.name,
      name,
      description,
      width,
      height,
      mimeType
    }}))
    // Webアプリ用の画像保存用
    await Storage.put(file.name, file)
    // OGP用の画像保存
    const credentials = await Auth.currentCredentials()
    AWS.config.update({ credentials: credentials, region: 'ap-northeast-1' })
    var s3 = new AWS.S3({ params: { Bucket: 'ogp-image' } })
    await s3.putObject({ Body: file, Key: file.name }).promise()
    // 一覧を再表示
    getImage()
  }
  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e.message)
        img.src = e.target.result
      }
    })
  }
  const renderImages = () => {
    return images.map((image, i) => (
      <img key={i} src={image.path} style={{ width: 320, marginRight: 16 }} onClick={ () => { handleToDetailPage(image.id) }} />
    ))
  }
  return (
    <div style={{padding: 16}} >
      <h1>Top</h1>
      {renderImages()}
      <div style={{marginTop: 24}}>
        <div>名前<input value={name} name="name" style={{margin: 4}} onChange={ (e) => setName(e.target.value) }></input></div>
        <div>説明<input value={description} name="name" style={{margin: 4}} onChange={ (e) => setDescription(e.target.value) }></input></div>
        <div>画像<input name="file" type="file" style={{margin: 4}} onChange={ (e) => setFile(e.target.files[0]) }></input></div>
        <button onClick={registerImage}>登録</button>
      </div>
    </div>
  )
}
