// ECharts 按需导入（tree-shakable），替代全量 import * as echarts from 'echarts'
// 仅引入项目实际使用的图表类型和组件，减少约 60-70% 的 ECharts 包体积
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  LinesChart,
  MapChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  GeoComponent,
  VisualMapComponent,
  GraphicComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-liquidfill'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  LinesChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  GeoComponent,
  VisualMapComponent,
  GraphicComponent,
  CanvasRenderer,
])

export default echarts
