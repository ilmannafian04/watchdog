import React, { FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import currentRoomAtom from '../../../atom/currentRoomAtom';
import playerStateAtom from '../../../atom/playerStateAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import playerProgressAtom from '../../../atom/playerProgressAtom';

const PlayerWindow: FunctionComponent<{ playerRef: RefObject<ReactPlayer> }> = ({ playerRef }) => {
    const [playerWidth, setPlayerWidth] = useState(400);
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const setPlayerProgress = useSetRecoilState(playerProgressAtom);
    const currentRoom = useRecoilValue(currentRoomAtom);
    const roomSocket = useRecoilValue(roomSocketAtom);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (wrapperRef.current !== null) {
            let newHeight = (wrapperRef.current.getBoundingClientRect().width / 16) * 9;
            if (newHeight > (window.innerHeight / 100) * 90) {
                newHeight = (window.innerHeight / 100) * 90;
            }
            setPlayerWidth(newHeight);
        }
    }, [wrapperRef]);
    const handlerPlayerManualPlayPause = (event: string) => {
        if (event === 'play' && !playerState.playing) {
            roomSocket.player?.send(JSON.stringify({ type: 'playerCommand', data: 'play' }));
            setPlayerState({ ...playerState, playing: true });
        } else if (event === 'pause' && playerState.playing) {
            roomSocket.player?.send(JSON.stringify({ type: 'playerCommand', data: 'pause' }));
            setPlayerState({ ...playerState, playing: false });
        }
    };
    return (
        <div ref={wrapperRef}>
            <ReactPlayer
                ref={playerRef}
                url={playerState.url ? playerState.url : currentRoom.currentVideo}
                width="100%"
                height={playerWidth}
                playing={playerState.playing}
                onPlay={() => handlerPlayerManualPlayPause('play')}
                onPause={() => handlerPlayerManualPlayPause('pause')}
                onEnded={() => setPlayerState({ ...playerState, playing: false })}
                onSeek={() => console.log('seeked')}
                onProgress={(state) => setPlayerProgress(state)}
            />
        </div>
    );
};

export default PlayerWindow;
