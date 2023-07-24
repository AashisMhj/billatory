import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import NepaliDate from 'nepali-date-converter';
import { Months } from '@/utils/constants';
import { getMonthlyFeeStats, getMonthlyPaymentStats, getYearlyFeeStats, getYearlyPaymentStats } from '@/services/fees.service';
import { DataGraphType } from '@/types';
const npDate = new NepaliDate(Date.now());

//
const areaChartOptions: ApexOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

interface Props {
    slot: string
}

interface SeriesType {
    name: string,
    data: Array<number>
}
const current_nepali_year = npDate.getYear();
const nepali_months = Months.map((el) => el.month_name);
const years = Array.from({ length: 10 }, (_: any, k) => current_nepali_year - k).reverse();

const ReportGraph = ({ slot }: Props) => {
    const [year_payment_data, setYearlyPaymentData] = useState<Array<number>>([]);
    const [year_fee_data, setYearlyFeeData] = useState<Array<number>>([]);
    const [monthly_payment_data, setMonthlyPaymentData] = useState<Array<number>>([]);
    const [monthly_fee_data, setMonthlyFeeData] = useState<Array<number>>([]);

    const theme = useTheme();
    const [series, setSeries] = useState<Array<SeriesType>>([
        {
            name: 'Paid Amount',
            data: []
        },
        {
            name: 'Total Fee',
            data: []
        }
    ]);

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState<ApexOptions>(areaChartOptions);

    useEffect(() => {
       
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.success.dark, theme.palette.primary[700]],
            xaxis: {
                categories:
                    slot === 'yearly' ? years : nepali_months,
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: slot === 'yearly' ? 12 : 10
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'dark'
            }
        }));
    }, [primary, secondary, line, theme, slot]);

    useEffect(() => {
        // TODO get data
        (async () => {

            let monthly_fee = await getMonthlyFeeStats(current_nepali_year) as Array<DataGraphType>;
            let monthly_payment = await getMonthlyPaymentStats(current_nepali_year) as Array<DataGraphType>;
            let yearly_fee = await getYearlyFeeStats() as Array<DataGraphType>;
            let yearly_payment = await getYearlyPaymentStats() as Array<DataGraphType>;

            let temp_monthly_fee_data = Array.from({length: 12}, (v:any, k:number) => 0);
            let temp_monthly_payment_data = Array.from({length: 12}, (v:any, k:number) => 0);
            let temp_yearly_fee_data = Array.from({length: 10}, (v:any, k:number) => 0);
            let temp_yearly_payment_data = Array.from({length: 10}, (v:any, k:number) => 0);
            monthly_fee.forEach((el) =>{
                temp_monthly_fee_data[el.val-1] = el.amount;
            });

            monthly_payment.forEach((el) =>{
                temp_monthly_payment_data[el.val-1] = el.amount
            });

            yearly_fee.forEach((el) => {
                const index = current_nepali_year - el.val;
                temp_yearly_fee_data[9 - index] = el.amount;
            });

            yearly_payment.forEach((el) => {
                const index = current_nepali_year - el.val;
                temp_yearly_payment_data[9 - index] = el.amount;
            });



            setMonthlyFeeData(temp_monthly_fee_data);
            setMonthlyPaymentData(temp_monthly_payment_data);
            setYearlyFeeData(temp_yearly_fee_data);
            setYearlyPaymentData(temp_yearly_payment_data);

        })()
    }, []);


    useEffect(() => {

        setSeries([
            {
                name: 'Paid Amount',
                data: slot === 'yearly' ? year_payment_data : monthly_payment_data
            },
            {
                name: 'Total Fes',
                data: slot === 'yearly' ? year_fee_data : monthly_fee_data
            }
        ]);
    }, [slot, monthly_fee_data, monthly_payment_data, year_fee_data, year_payment_data]);

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};


export default ReportGraph;
