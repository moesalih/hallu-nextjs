import { useQuery } from '@tanstack/react-query'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

import { PaddedSpinner } from '@/lib/components/ui'
import { accentColor } from '@/lib/metadata'
import { formatNumber } from '@/lib/utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function BarChartFromQuery({ queryKey, queryFn, title, subtitleFunc, xProp, yProp }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: 5 * 60 * 1000,
  })

  const subtitle = useMemo(() => {
    if (!data || !subtitleFunc) return null
    return subtitleFunc(data)
  }, [data])

  if (isLoading) return <PaddedSpinner />
  if (!data) return null

  return (
    <div className="p-4">
      <div className="flex flex-row items-start justify-between gap-4  mb-4">
        <div className="font-medium">{title}</div>
        {subtitle && <div className="whitespace-pre-wrap text-right">{subtitle}</div>}
      </div>

      <ChartFromData data={data} title={title} xProp={xProp} yProp={yProp} />
    </div>
  )
}

function ChartFromData({ data, title, xProp, yProp, type = 'bar' }) {
  const config = useMemo(() => {
    return getChartConfig({ data, title, xProp, yProp, type })
  }, [data])

  if (!data || !config) return null
  return <Chart config={config} />
}

function Chart({ config }) {
  if (!config) return null
  // return <img src={getChartImageUrl(config)} className="w-full mb-5" />
  return <Bar data={config.data} options={config.options} />
}

// function getChartImageUrl(chartConfig) {
//   return `https://quickchart.io/chart?w=500&h=350&c=${encodeURIComponent(JSON.stringify(chartConfig))}`
// }

function getChartConfig({ data, title, xProp, yProp, type = 'bar' }) {
  if (!data) return null
  const data_ = data?.slice().reverse()
  // const color = 'rgba(54, 162, 235, 1)'
  const color = accentColor
  const chartData = {
    labels: data_.map((item: any) => item[xProp]?.slice(5, 10)),
    datasets: [
      {
        label: title,
        data: data_?.map((item: any) => item[yProp]),
        backgroundColor: type == 'line' ? 'transparent' : color,
        borderColor: color,
      },
    ],
  }
  const chart = {
    type: type,
    data: chartData,
    options: chartOptions,
  }

  return chart
}

const gridLineColor = 'rgba(130, 130, 130, 0.2)'

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.45,
  animation: false,
  elements: {
    point: {
      radius: 0, // Set pointRadius globally for all datasets
    },
  },

  plugins: {
    legend: {
      display: false,
      // labels: {
      //   boxWidth: 20,
      //   fontColor: '#888',
      // },
    },
  },
  scales: {
    y: {
      stacked: true,
      ticks: {
        beginAtZero: true,
        fontColor: '#888',
        callback: formatNumber,
      },
      grid: {
        color: gridLineColor,
        zeroLineColor: gridLineColor,
      },
    },
    x: {
      stacked: true,
      ticks: {
        fontColor: '#888',
      },
      grid: {
        display: false,
        color: gridLineColor,
        zeroLineColor: gridLineColor,
      },
    },
  },
}
