import { Helmet } from 'react-helmet-async'
import {
  useExportReportMutation,
  useGetReportOrdersStatisticsQuery,
  useGetReportTop10Query,
  useGetReportTurnoverStatisticsQuery,
  useGetReportUserStatisticsQuery
} from '@/features/report/reportApi.ts'
import dayjs from 'dayjs'
import { type ReactNode, useMemo, useState } from 'react'
import { List, ListItemButton, Typography } from '@mui/material'
import { UploadCloudIcon } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import ConfirmButton from '@/components/ConfirmButton.tsx'

const Statistics = () => {
  const DateRange = useMemo(
    () =>
      ({
        yesterday: '0',
        past7: '1',
        past30: '2',
        week: '3',
        month: '4'
      }) as const,
    []
  )

  type DateValueRange = (typeof DateRange)[keyof typeof DateRange]

  const template = 'YYYY-MM-DD' as const

  const dateMap = useMemo(
    () =>
      [
        {
          value: DateRange.yesterday,
          label: '昨日',
          begin: dayjs().subtract(1, 'day').format(template),
          end: dayjs().subtract(1, 'day').format(template)
        },
        {
          value: DateRange.past7,
          label: '近7天',
          begin: dayjs().subtract(7, 'day').format(template),
          end: dayjs().format(template)
        },
        {
          value: DateRange.past30,
          label: '近30天',
          begin: dayjs().subtract(30, 'day').format(template),
          end: dayjs().format(template)
        },
        {
          value: DateRange.week,
          label: '本周',
          begin: dayjs().startOf('week').format(template),
          end: dayjs().endOf('week').format(template)
        },
        {
          value: DateRange.month,
          label: '本月',
          begin: dayjs().startOf('month').format(template),
          end: dayjs().endOf('month').format(template)
        }
      ] as const,
    [DateRange]
  )

  const [dateRange, setDateRange] = useState<DateValueRange>(DateRange.past7)

  const [begin, end] = useMemo(() => {
    const selectedRange = dateMap.find(item => item.value === dateRange)
    return [
      selectedRange?.begin ?? dayjs().subtract(7, 'day').format(template),
      selectedRange?.end ?? dayjs().format(template)
    ]
  }, [dateRange, dateMap])

  const { data: reportOrdersStatistics } = useGetReportOrdersStatisticsQuery({
    begin,
    end
  })
  const { data: reportTop10 } = useGetReportTop10Query({
    begin,
    end
  })
  const { data: reportTurnoverStatistics } = useGetReportTurnoverStatisticsQuery({
    begin,
    end
  })
  const { data: reportUserStatistics } = useGetReportUserStatisticsQuery({
    begin,
    end
  })
  const [exportReport] = useExportReportMutation()

  const handleExport = async () => {
    try {
      const data = await exportReport().unwrap()
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = '运营数据统计表.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.log(e)
    }
  }

  const options: (EChartsOption & {
    children?: ReactNode
  })[] = [
    {
      title: {
        text: '营业额统计'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: reportTurnoverStatistics?.data.dateList.split(','),
        name: '营业额(元)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: [30, 0, 0, 0]
        }
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'line',
          data: reportTurnoverStatistics?.data.turnoverList.split(','),
          color: '#FFD000',
          symbol: 'none'
        }
      ]
    },
    {
      title: {
        text: '用户统计'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: reportUserStatistics?.data.dateList.split(',')
      },
      yAxis: {},
      legend: {
        data: ['用户总量', '新增用户'],
        formatter: name => `${name}(个)`,
        bottom: 0,
        lineStyle: {}
      },
      series: [
        {
          name: '用户总量',
          type: 'line',
          data: reportUserStatistics?.data.totalUserList.split(','),
          color: '#FFD000',
          symbol: 'none'
        },
        {
          name: '新增用户',
          type: 'line',
          data: reportUserStatistics?.data.newUserList.split(','),
          color: '#ED8683',
          symbol: 'none'
        }
      ]
    },
    {
      title: {
        text: '订单统计'
      },
      xAxis: {
        data: reportOrdersStatistics?.data.dateList.split(',')
      },
      legend: {
        data: ['订单总数', '有效订单'],
        formatter: name => `${name}(个)`,
        bottom: 0
      },
      yAxis: {},
      series: [
        {
          name: '订单总数',
          data: reportOrdersStatistics?.data.orderCountList.split(','),
          color: '#FFD000',
          symbol: 'none',
          type: 'line'
        },
        {
          name: '有效订单',
          data: reportOrdersStatistics?.data.validOrderCountList.split(','),
          color: '#FD8683',
          symbol: 'none',
          type: 'line'
        }
      ],
      tooltip: {
        trigger: 'axis'
      }
    },
    {
      title: {
        text: '销量排行TOP10'
      },
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        data: reportTop10?.data.nameList.split(','),
        axisLine: {}
      },
      series: [
        {
          type: 'bar',
          data: reportTop10?.data.numberList.split(',').map(Number),
          color: '#FFD000',
          name: '销量',
          barMaxWidth: 20,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            borderRadius: [0, 10, 10, 0]
          }
        }
      ],
      tooltip: {
        trigger: 'axis'
      }
    }
  ]

  return (
    <>
      <Helmet>
        <title>数据统计</title>
      </Helmet>
      <div className={'flex min-h-full flex-col gap-5 p-5'}>
        <div className={'flex items-center justify-between'}>
          <div className={'flex items-center gap-5'}>
            <List disablePadding className={'flex'}>
              {dateMap.map(item => (
                <ListItemButton
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#F6C343'
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#F6C343'
                    }
                  }}
                  key={item.value}
                  onClick={() => setDateRange(item.value)}
                  selected={dateRange === item.value}
                  className={'flex items-center rounded-none border border-gray-300 px-5 py-2'}
                >
                  {item.label}
                </ListItemButton>
              ))}
            </List>
            <Typography variant={'body2'}>{`已选时间：${begin} 至 ${end}`}</Typography>
          </div>
          <ConfirmButton
            startIcon={<UploadCloudIcon />}
            variant={'outlined'}
            className={
              'hover:text-[ border-gray-300 text-black transition-colors duration-300 ease-in-out hover:border-[#F6C443] hover:text-[#F6C443]'
            }
            title={'数据导出'}
            onConfirm={handleExport}
          >
            数据导出
          </ConfirmButton>
        </div>
        <div className={'grid grid-cols-2 gap-5 rounded'}>
          {options.map(option => (
            <div className={'h-100 flex flex-col gap-5 rounded bg-white p-5 shadow'}>
              {option.children}
              <ReactECharts
                option={option}
                notMerge
                opts={{
                  renderer: 'canvas',
                  locale: 'zh-CN'
                }}
                style={{
                  height: '100%'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Statistics
