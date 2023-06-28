import { ReactNode } from "react";
import { Box, Chip, ChipProps, Grid, Stack, Typography } from '@mui/material';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import MainCard from "@/components/layouts/MainCard";

type Props =  {
    color?: ChipProps['color'],
    title: string,
    count: string,
    percentage?: number,
    isLoss?: boolean,
    extra?: ReactNode | String
}
export default function AnalyticCard({ color="primary", title, count, percentage, isLoss, extra }: Props) {
    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Stack spacing={0.5}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h4" color="inherit" sx={{ color: `${color || 'primary'}.main` }}>
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
            </Stack>
        </MainCard>
    )
}