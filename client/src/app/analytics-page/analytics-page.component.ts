import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending= true

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** gaine выручка **** Тест графика
      // gainConfig.labels.push('31.07.2018')
      // gainConfig.data.push(9000)
      // gainConfig.labels.push('1.08.2018')
      // gainConfig.data.push(9500)
      // **** gaine выручка **** Тест графика

      // **** order Заказы **** Тест графика
      // orderConfig.labels.push('31.07.2018')
      // orderConfig.data.push(8)
      // orderConfig.labels.push('1.08.2018')
      // orderConfig.data.push(5)
      // **** order Заказы **** Тест графика

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
