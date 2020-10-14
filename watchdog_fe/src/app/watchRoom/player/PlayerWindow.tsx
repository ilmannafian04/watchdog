import React, { FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilState, useRecoilValue } from 'recoil';

import playerStateAtom from '../../../atom/playerStateAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';

interface PlayerWindowProps {
    playerRef: RefObject<ReactPlayer>;
}

const PlayerWindow: FunctionComponent<PlayerWindowProps> = ({ playerRef }) => {
    const [playerWidth, setPlayerWidth] = useState(400);
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
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
                url={playerState.url}
                width="100%"
                height={playerWidth}
                playing={playerState.playing}
                onPlay={() => handlerPlayerManualPlayPause('play')}
                onPause={() => handlerPlayerManualPlayPause('pause')}
                onEnded={() => setPlayerState({ ...playerState, playing: false })}
            />
        </div>
    );
};

export default PlayerWindow;
