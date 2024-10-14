import React, { useRef, useState, useEffect } from 'react';
import * as Indoor from 'src/@core/components/digital-map/Indoor';
import CameraView from '../popups/CameraView';

const IndoorMap = ({ imgURL, cameraGroup, setCameraGroup }) => {
    const [reload, setReload] = useState(0);
    const [isOpenViewCamera, setIsOpenViewCamera] = useState(false);
    const [markerSelected, setMarkerSelected] = useState(null);
    const mapEl = useRef(null);
    const markers = useRef([]);
    const radar = useRef(null);
    const newMap = useRef(null);
    const [camerasSelected, setCamerasSelected] = useState([])

    useEffect(() => {
        if (cameraGroup?.length > 0) {
            setReload(prevReload => prevReload + 1);
            console.log('cameraGroup', cameraGroup);

        }
        setCamerasSelected(cameraGroup)
    }, [cameraGroup])

    useEffect(() => {
        // if (cameraGroup.length > 0) {
        //     initializeMap();
        // }
        if (imgURL !== "" && imgURL !== null) {
            initializeMap();
        }
    }, [reload, imgURL]);

    const handleAddPositionCameras = () => {

    }

    const initializeMap = () => {
        if (typeof window !== 'undefined') {
            newMap.current = new Indoor.Map(mapEl.current, {
                floorplan: new Indoor.Floor({
                    url: imgURL,
                    opacity: 0.7,
                    width: 400,
                    zIndex: 1,
                }),
                minZoom: 0.001,
                maxZoom: 10,
            });

            newMap.current.on('ready', () => {
                addMarkers();
            });

            newMap.current.on('marker:removed', handleMarkerRemoved);
            newMap.current.on('marker:click', handleMarkerClick);
            newMap.current.on('marker:rightclick', handleMarkerRightClick);
            newMap.current.on('marker:moving', handleMarkerMoving);
            newMap.current.on('marker:moved', handleMarkerMoved);
            newMap.current.on('markergroup:moving', handleMarkerGroupMoving);
            newMap.current.on('markergroup:rotating', handleMarkerGroupRotating);
            newMap.current.on('marker:rotating', handleMarkerRotating);
            newMap.current.on('bbox:moving', handleBBoxMoving);
            newMap.current.on('object:drag', handleObjectDrag);
            newMap.current.on('object:scaling', handleObjectScaling);
            newMap.current.on('object:rotate', handleObjectRotate);
            newMap.current.on('mouse:move', handleMouseMove);
            newMap.current.on('contextmenu', handleContextMenu);
        }
    };

    const removeAllMarkers = () => {
        // console.log('markers', markers);
        if (markers.current) {
            // markers.current.forEach((marker) => {
            //     marker.remove();
            // });
            markers.current = [];
        }
    };

    const addMarkers = () => {
        removeAllMarkers();

        if (cameraGroup?.length > 0) {
            for (let i = 0; i < cameraGroup.length; i += 1) {
                const x = Math.random() * 400 - 200;
                const y = Math.random() * 400 - 200;

                const marker = new Indoor.Marker([x, y], {
                    text: `${cameraGroup[i].name}`,
                    draggable: true,
                    zIndex: 100,
                    id: cameraGroup[i].id,
                });

                marker.on('ready', () => {
                    marker.addTo(newMap.current);
                    markers.current.push(marker);
                    if (typeof window !== 'undefined') {
                        window.markers = markers.current;
                    }
                });
            }

            setTimeout(() => {
                addLinks();
                addRadar(markers.current[0], 90);
            }, 1000);
            const rect = Indoor.markerGroup([[0, 0], [100, 200]]);
            rect.on('moving', handleMarkerGroupMoving);
            rect.addTo(newMap.current);
        }
    };

    const addLinks = () => {
        for (let i = 1; i < markers.current.length; i += 1) {
            markers.current[i].setLinks([markers.current[i - 1]]);
        }
    };

    const addRadar = (marker, rotation) => {
        if (radar.current) {
            newMap.current.removeLayer(radar.current);
        }

        radar.current = new Indoor.Marker(marker.position, {
            size: 100,
            id: marker.id,
            icon: {
                url: '/images/radar.png',
            },
            rotation: rotation,
            clickable: false,
            zIndex: 290,
        });

        radar.current.on('ready', () => {
            radar.current.addTo(newMap.current);
        });

        if (typeof window !== 'undefined') {
            window.radar = radar.current;
        }
    };

    const handleMarkerRemoved = (e) => {
    };

    const handleMarkerRightClick = (e) => {
        setIsOpenViewCamera(true);
    }

    const handleMarkerClick = (e) => {

        // e.e.preventDefault();
        // addRadar(e, 100);
        setMarkerSelected(e);
    };

    const handleContextMenu = (e) => {
    }

    const handleMarkerMoving = (e) => {
        if (radar.current && e.id === radar.current.id) {
            radar.current.setPosition(e.position);
        }
    };

    const handleMarkerMoved = (e) => {
        if (radar.current && e.id === radar.current.id) {
            radar.current.setPosition(e.position);
        }
    };

    const handleMarkerGroupMoving = (e) => {
        // console.log('markergroup:moving', e);
    };

    const handleMarkerGroupRotating = (e, angle) => {
        // console.log('markergroup:rotating', e, angle);
    };

    const handleMarkerRotating = (e, angle) => {
        // console.log('marker:rotating', e, angle);
    };

    const handleBBoxMoving = () => {
        // console.log('bbox:moving');
    };

    const handleObjectDrag = (e) => {
        // console.log('object:drag', e);
    };

    const handleObjectScaling = (e) => {
        // console.log('object:scaling', e);
    };

    const handleObjectRotate = (e) => {
        // console.log('object:rotate', e);
    };

    const handleMouseMove = () => {
        // console.log('mouse:move');
    };

    const handleAddRadar = values => {
        const rotation = parseInt(values?.rotation);
        addRadar(markerSelected, rotation);
    };

    return (
        <>
            <div key={reload} className="my-map" ref={mapEl} style={{ height: '100vh', width: '100%' }} />
            {isOpenViewCamera &&
                <CameraView
                    show={isOpenViewCamera}
                    data={markerSelected}
                    callback={handleAddRadar}
                    onClose={() => setIsOpenViewCamera(false)}
                />
            }
        </>
    );
};

export default IndoorMap;
