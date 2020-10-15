import { Box } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import IChatMessage from '../../../type/chatMessage';

const ChatMessage: FunctionComponent<IChatMessage> = ({ name, message, color }) => {
    return (
        <span>
            <Box component={'span'} color={color}>
                <b>{name}</b>
            </Box>
            : {message}
        </span>
    );
};

export default ChatMessage;
