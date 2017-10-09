import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBuilderComponent } from './charts-builder.component';
import { MaterialModule } from '@angular/material';
import { DataTableComponent } from './data-table';
import { CodemirrorModule } from 'ng2-codemirror';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'ng2-handsontable';

import { BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
  LineChartComponent, PieChartComponent, SunburstChartComponent,
  WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
  PieGridChartComponent, TreemapChartComponent
} from '../../../../charts';

import { CodeEditorComponent } from './code-editor';
import {NgxChartsModule } from '@swimlane/ngx-charts';

describe('ChartBuilderComponent', () => {
  let component: ChartBuilderComponent;
  let fixture: ComponentFixture<ChartBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBuilderComponent, DataTableComponent, CodeEditorComponent, BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
        LineChartComponent, PieChartComponent, SunburstChartComponent, WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
        PieGridChartComponent, TreemapChartComponent ],
      imports: [
        MaterialModule,
        NgxChartsModule,
        CodemirrorModule,
        FormsModule,
        DndModule.forRoot(),
        HotTableModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
