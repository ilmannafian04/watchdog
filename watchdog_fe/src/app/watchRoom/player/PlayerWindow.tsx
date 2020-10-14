import React, { FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilState } from 'recoil';

import playerStateAtom from '../../../atom/PlayerStateAtom';

interface PlayerWindowProps {
    playerRef: RefObject<ReactPlayer>;
}

const PlayerWindow: FunctionComponent<PlayerWindowProps> = ({ playerRef }) => {
    const [playerWidth, setPlayerWidth] = useState(400);
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
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
    return (
        <div ref={wrapperRef}>
            <ReactPlayer
                ref={playerRef}
                url="https://youtu.be/I4ocxF3sSI0"
                width="100%"
                height={playerWidth}
                playing={playerState.playing}
                onEnded={() => setPlayerState({ ...playerState, playing: false })}
            />
        </div>
    );
};

export default PlayerWindow;
