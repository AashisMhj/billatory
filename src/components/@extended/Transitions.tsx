import PropTypes from 'prop-types';
import { ReactNode, forwardRef } from 'react';

// material-ui
import { Fade, Box, Grow, FadeProps } from '@mui/material';

// ==============================|| TRANSITIONS ||============================== //
type ValidType = 'grow' | 'fade' | 'collapse' | 'slide' | 'zoom';
type ValidPosition = 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom'
type  Props = {
  children: ReactNode,
  type?: ValidType,
  position?: ValidPosition
} & FadeProps
const Transitions = forwardRef(({ children, position='top-left', type='grow', ...others }:Props, ref) => {
  let positionSX = {
    transformOrigin: '0 0 0'
  };

  switch (position) {
    case 'top-right':
    case 'top':
    case 'bottom-left':
    case 'bottom-right':
    case 'bottom':
    case 'top-left':
    default:
      positionSX = {
        transformOrigin: '0 0 0'
      };
      break;
  }

  return (
    <Box ref={ref}>
      {type === 'grow' && (
        <Grow {...others}>
          <Box sx={positionSX}>{children}</Box>
        </Grow>
      )}
      {type === 'fade' && (
        <Fade
          {...others}
          timeout={{
            appear: 0,
            enter: 300,
            exit: 150
          }}
        >
          <Box sx={positionSX}>{children}</Box>
        </Fade>
      )}
    </Box>
  );
});

Transitions.defaultProps = {
  type: 'grow',
  position: 'top-left'
};

export default Transitions;
