import { ReactNode } from "react";
import {  Chip,useTheme, ChipProps, Grid, Stack, Typography, Icon } from '@mui/material';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import MainCard from "@/components/layouts/MainCard";

type Props =  {
    color?: ChipProps['color'],
    title: string,
    count: string,
    percentage?: number,
    isLoss?: boolean,
    extra?: ReactNode | String,
    icon: ReactNode
}
export default function AnalyticCard({ color="primary", title, count, percentage, isLoss, icon }: Props) {
    const theme = useTheme()
    return (
        <MainCard contentSX={{ p: 6.25 }} boxShadow shadow={theme.customShadows.card} >
            <Stack spacing={0.8} alignItems='center'>
                {icon}
                <Grid container alignItems="center" justifyContent='center'>
                    <Grid item>
                        <Typography variant="h3" color="inherit" sx={{ color: `${color || 'primary'}.main` }}>
                            {count}
                        </Typography>
                    </Grid>
                    {percentage && (
                        <Grid item>
                            <Chip
                                variant="outlined"
                                color={color}
                                icon={
                                    <>
                                        {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                        {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                    </>
                                }
                                label={`${percentage}%`}
                                sx={{ ml: 1.25, pl: 1 }}
                                size="small"
                            />
                        </Grid>
                    )}
                </Grid>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
            </Stack>
        </MainCard>
    )
}