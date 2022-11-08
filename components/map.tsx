import Konva from 'konva';
import { useEffect } from 'react';

export default function Map() {
    
    useEffect(() => {  
        let Stage = new Konva.Stage({
          container: "canvas",
          width: (window.innerWidth / 12) * 8,
          height: window.innerHeight,
        });
        
          let Bg = new Konva.Layer();
          Stage.add(Bg);
    
          let BgImage = new Image();
          BgImage.onload = () => {
            let img = new Konva.Image({
              x: 0,
              y: 0,
              image: BgImage,
              width: (window.innerWidth / 12) * 8,
              height: BgImage.height,
            });
            Bg.add(img);
          };
          BgImage.src = '/img/map.png';  
      },[]);

  return (
    <div id="canvas" className="bg-light"></div>
  )
}
