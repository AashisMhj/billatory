import PropTypes from 'prop-types';
import { ReactNode, forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, CardProps, Divider, Typography } from '@mui/material';

// project import
import Highlighter from '@/components/third-party/Highlighter';

// header style
const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //
type Props = {
  border?: boolean,
  boxShadow?: boolean,
  contentSX?: Object,
  darkTitle?: boolean,
  divider?: boolean,
  elevation?: number,
  shadow?: string,
  codeHighlight?: boolean,
  secondary?: ReactNode,
  cardContent?: boolean
} & CardProps

// TODO why not content

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      cardContent = true,
      contentSX = {},
      darkTitle,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight,
      ...others
    }:Props,
    ref
  ) => {
    const theme = useTheme();
    boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

    return (
      <Card
        elevation={elevation || 0}
        // ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderRadius: 2,
          // borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,
          borderColor: theme.palette.divider ,
          // boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',
          ':hover': {
            // TODO customize theme
            // boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
            boxShadow: shadow
          },
          '& pre': {
            m: 0,
            p: '16px !important',
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.75rem'
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />
        )}
        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />}

        {/* card content */}
        {cardContent && <CardContent sx={contentSX}>{children}</CardContent>}
        {!cardContent && children}

        {/* card footer - clipboard & highlighter  */}
        {codeHighlight && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Highlighter
            //  codeHighlight={codeHighlight} 
            //  main
             >
              {children}
            </Highlighter>
          </>
        )}
      </Card>
    );
  }
);

export default MainCard;
