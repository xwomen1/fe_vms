import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import MaskGroup from '../Imge/NoAvatar.svg';

const Img = props => {
  const [loaded, setLoaded] = useState(false);
  const { src, style } = props;
  const [url, setUrl] = useState(null);
  
  useEffect(() => {
    if (src) {
      setUrl(src);
    } else {
      setUrl(MaskGroup);
    }
  }, [src]);

  return (
    <div style={{ ...style, display: 'inline-block' }}>
      <div
        style={
          loaded
            ? { display: 'none' }
            : {
                ...style,
                width: '100%',
                height: '100%',
                display: 'grid',
                backgroundColor: '#C4C4C4',
                placeItems: 'center',
              }
        }
      >
        <CircularProgress size={20} />
      </div>
      <img
        {...props}
        src={url}
        alt="Ảnh"
        onLoad={() => setLoaded(true)}
        onError={() => setUrl(MaskGroup)}
        style={loaded ? { ...style, width: 'unset' } : { display: 'none' }}
      />
    </div>
  );
};


export default React.memo(Img);
