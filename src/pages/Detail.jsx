import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API, graphqlOperation, Storage } from "aws-amplify"
import { getImage } from '../graphql/queries'

export const Detail = () => {
  const { id } = useParams();
  const [image, setImage] = useState({})

  useEffect(() => {
    const f = async () => {
      const res = await API.graphql(graphqlOperation(getImage, { id: id }))
      const image = res.data.getImage
      image.path = await Storage.get(image.path)
      setImage(image)
    }
    f();
  }, [ id ]);

  return (
    <div>
      <h1>Detail</h1>
      <div>
        <img src={image.path} style={{ width: 640 }} />
        <p>{image.description}</p>
      </div>
    </div>
  )
}
