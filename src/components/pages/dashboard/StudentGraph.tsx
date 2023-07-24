import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import { useTheme } from '@mui/material/styles';
import { getClasses } from '@/services/class.service';
import { ClassTableType } from '@/types';
const columnChartOptions: ApexOptions = {
    chart: {
        type: 'bar',
        height: 430,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '30%',
            borderRadius: 4
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
    },
    xaxis: {
        categories: []
    },
    yaxis: {
        title: {
            text: 'No Students'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter(val) {
                return `${val}`;
            }
        }
    },
    legend: {
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
            useSeriesColors: false
        },
        markers: {
            width: 16,
            height: 16,
            radius: 50,
        },
        itemMargin: {
            horizontal: 15,
            vertical: 50
        }
    },
    responsive: [
        {
            breakpoint: 600,
            options: {
                yaxis: {
                    show: false
                }
            }
        }
    ]
};

interface SeriesType {
    name: string,
    data: Array<number>
}

const StudentGraph = () => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    const [classes, setClasses] = useState<Array<string>>([]);


    const warning = theme.palette.warning.main;
    const primaryMain = theme.palette.primary.main;
    const successDark = theme.palette.success.dark;

    const [series, setSeries] = useState<Array<SeriesType>>([
        {
            name: 'Male',
            data: []
        },
        {
            name: 'Female',
            data: []
        }
    ]);

    const [options, setOptions] = useState<ApexOptions>(columnChartOptions);

    useEffect(() => {
        getClasses(1, 999)
            .then(data => {
                if (typeof data === "string") {
                    const class_data = JSON.parse(data) as Array<ClassTableType>;
                    let temp_male_data:Array<number> = [];
                    let temp_female_data:Array<number> = [];
                    let temp_classes:Array<string> = [];

                    class_data.forEach((el) =>{
                        temp_male_data.push(el.male_count);
                        temp_female_data.push(el.female_count);
                        temp_classes.push(el.class);
                    });

                    setSeries([
                        {
                            name: 'Male',
                            data: temp_male_data
                        },
                        {
                            name: 'Female',
                            data: temp_female_data
                        }
                    ]);
                    setClasses(temp_classes);
                    
                }
            })
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [warning, primaryMain],
            xaxis: {
                categories: classes,
                labels: {
                    style: {
                        colors: [secondary, secondary, secondary, secondary, secondary, secondary]
                    }
                }
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
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                labels: {
                    colors: 'grey.500'
                }
            }
        }));

    }, [primary, secondary, line, warning, primaryMain, successDark, classes]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={420} />
        </div>
    );
};

export default StudentGraph;
