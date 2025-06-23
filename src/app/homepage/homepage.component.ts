import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import * as Stomp from '@stomp/stompjs';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexTitleSubtitle,
  ChartComponent
} from 'ng-apexcharts';
import { NgForOf, NgIf } from '@angular/common';

interface Notification {
  type: 'Humidity' | 'Temperature' | 'Proximity' | 'Light';
  message: string;
  timestamp: string; // Add timestamp property
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [
    ChartComponent,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    lastLogin: string;
    userRole: string;
  } | null = null;

  humidities: { value: number; measuredOn: string }[] = [];
  temperatures: { value: number; measuredOn: string }[] = [];
  proximities: { value: number; measuredOn: string }[] = [];
  lights: { value: number; measuredOn: string }[] = [];

  // Chart configuration
  public chartSeries: ApexAxisChartSeries = [
    {
      name: 'Humidity',
      data: [] // Humidity values
    }
  ];
  public chartOptions: {
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
  } = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: [] // Time labels
    },
    yaxis: {
      title: {
        text: 'Humidity (%)' // Unit of measure for humidity
      }
    },
    title: {
      text: 'Humidity Over Time'
    }
  };

  // Add temperature chart configuration
  public temperatureChartSeries: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: [] // Temperature values
    }
  ];
  public temperatureChartOptions: {
    chart: ApexChart;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
  } = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: [] // Time labels
    },
    yaxis: {
      title: {
        text: 'Temperature °C' // Unit of measure for humidity
      }
    },
    title: {
      text: 'Temperature Over Time'
    }
  };

  // Add proximity chart configuration
  public proximityChartSeries: ApexAxisChartSeries = [
    {
      name: 'Proximity',
      data: [] // Proximity values
    }
  ];
  public proximityChartOptions: {
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
  } = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: [] // Time labels
    },
    yaxis: {
      title: {
        text: 'Proximity (cm)' // Unit of measure for proximity
      }
    },
    title: {
      text: 'Proximity Over Time'
    }
  };

  // Add light chart configuration
  public lightChartSeries: ApexAxisChartSeries = [
    {
      name: 'Light',
      data: [] // Light values
    }
  ];
  public lightChartOptions: {
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
  } = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: [] // Time labels
    },
    yaxis: {
      title: {
        text: 'Light (lux)' // Unit of measure for light
      }
    },
    title: {
      text: 'Light Over Time'
    }
  };


  constructor(private userService: UserService) {}

  private stompClient: Stomp.Client | null = null;

  ngOnInit(): void {
    this.user = this.userService.getUser(); // Retrieve user data from the service
    console.log('User data received in homepage:', this.user);
    this.connectToWebSocket();
  }

  private connectToWebSocket(): void {
    this.stompClient = new Stomp.Client({
      brokerURL: 'ws://localhost:9090/ws',
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');

      // Subscribe to humidity topic
      this.stompClient?.subscribe('/topic/humidity', (message) => {
        const data = JSON.parse(message.body);

        // Format humidity value to 1 decimal place
        const formattedHumidity = parseFloat(parseFloat(data.humidity.value).toFixed(1));

        // Convert timestamp to readable date-time format
        const formattedTimestamp = new Date(data.humidity.measuredOn).toLocaleString();

        // Update humidity chart data
        const updatedHumidityCategories = [...this.chartOptions.xaxis.categories, formattedTimestamp];
        const updatedHumiditySeries = [
          {
            name: 'Humidity',
            data: [...(this.chartSeries[0].data as number[]), formattedHumidity]
          }
        ];

        // Update humidity chart options
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: updatedHumidityCategories
          }
        };
        this.chartSeries = updatedHumiditySeries as ApexAxisChartSeries;

        // Update humidity array for display
        this.humidities.push({
          value: formattedHumidity,
          measuredOn: formattedTimestamp
        });
        this.checkValues();
      });

      // Subscribe to temperature topic
      this.stompClient?.subscribe('/topic/temperature', (message) => {
        const data = JSON.parse(message.body);
        console.log('Temperature data received:', data);

        // Format temperature value to 1 decimal place
        const formattedTemperature = parseFloat(parseFloat(data.temperature.value).toFixed(1));

        // Convert timestamp to readable date-time format
        const formattedTimestamp = new Date(data.temperature.measuredOn).toLocaleString();

        // Update temperature chart data
        const updatedTemperatureCategories = [...this.temperatureChartOptions.xaxis.categories, formattedTimestamp];
        const updatedTemperatureSeries = [
          {
            name: 'Temperature',
            data: [...(this.temperatureChartSeries[0].data as number[]), formattedTemperature]
          }
        ];

        // Update temperature chart options
        this.temperatureChartOptions = {
          ...this.temperatureChartOptions,
          xaxis: {
            ...this.temperatureChartOptions.xaxis,
            categories: updatedTemperatureCategories
          }
        };
        this.temperatureChartSeries = updatedTemperatureSeries as ApexAxisChartSeries;

        // Update temperature array for display
        this.temperatures.push({
          value: formattedTemperature,
          measuredOn: formattedTimestamp
        });
      });


      // Subscribe to proximity topic
      this.stompClient?.subscribe('/topic/proximity', (message) => {
        const data = JSON.parse(message.body);

        // Format proximity value to 1 decimal place
        const formattedProximity = parseFloat(parseFloat(data.proximity.value).toFixed(1));

        // Convert timestamp to readable date-time format
        const formattedTimestamp = new Date(data.proximity.measuredOn).toLocaleString();

        // Update proximity chart data
        const updatedProximityCategories = [...this.proximityChartOptions.xaxis.categories, formattedTimestamp];
        const updatedProximitySeries = [
          {
            name: 'Proximity',
            data: [...(this.proximityChartSeries[0].data as number[]), formattedProximity]
          }
        ];

        // Update proximity chart options
        this.proximityChartOptions = {
          ...this.proximityChartOptions,
          xaxis: {
            ...this.proximityChartOptions.xaxis,
            categories: updatedProximityCategories
          }
        };
        this.proximityChartSeries = updatedProximitySeries as ApexAxisChartSeries;

        // Update proximity array for display
        this.proximities.push({
          value: formattedProximity,
          measuredOn: formattedTimestamp
        });
      });

      // Subscribe to light topic
      this.stompClient?.subscribe('/topic/light', (message) => {
        const data = JSON.parse(message.body);

        // Format light value to 1 decimal place
        const formattedLight = parseFloat(parseFloat(data.light.value).toFixed(1));

        // Convert timestamp to readable date-time format
        const formattedTimestamp = new Date(data.light.measuredOn).toLocaleString();

        // Update light chart data
        const updatedLightCategories = [...this.lightChartOptions.xaxis.categories, formattedTimestamp];
        const updatedLightSeries = [
          {
            name: 'Light',
            data: [...(this.lightChartSeries[0].data as number[]), formattedLight]
          }
        ];

        // Update light chart options
        this.lightChartOptions = {
          ...this.lightChartOptions,
          xaxis: {
            ...this.lightChartOptions.xaxis,
            categories: updatedLightCategories
          }
        };
        this.lightChartSeries = updatedLightSeries as ApexAxisChartSeries;

        // Update light array for display
        this.lights.push({
          value: formattedLight,
          measuredOn: formattedTimestamp
        });
      });

    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };

    this.stompClient.activate();
  }


  selectedChart: string = 'All'; // Default value is 'All'
  notifications: Notification[] = [];

  humidityOffset: number = 55;
  temperatureOffset: number = 28.5;
  proximityOffset: number = 80;
  lightOffset: number = 950;

  selectChart(chart: string): void {
    this.selectedChart = chart; // Update the selected chart
  }

  humidityNotifications: Notification[] = [];
  temperatureNotifications: Notification[] = [];
  proximityNotifications: Notification[] = [];
  lightNotifications: Notification[] = [];

  checkValues() {
    // Check the latest humidity value
    if (this.humidities.length > 0) {
      const latestHumidity = this.humidities[this.humidities.length - 1].value;
      if (latestHumidity > this.humidityOffset) {
        this.humidityNotifications.push({
          type: 'Humidity',
          message: `Humidity value (${latestHumidity}) exceeded offset (${this.humidityOffset})!`,
          timestamp: new Date().toLocaleString() // Add timestamp
        });
      }
    }

    // Check the latest temperature value
    if (this.temperatures.length > 0) {
      const latestTemperature = this.temperatures[this.temperatures.length - 1].value;
      if (latestTemperature > this.temperatureOffset) {
        this.temperatureNotifications.push({
          type: 'Temperature',
          message: `Temperature value (${latestTemperature}) exceeded offset (${this.temperatureOffset})!`,
          timestamp: new Date().toLocaleString()
        });
      }
    }

    // Check the latest proximity value
    if (this.proximities.length > 0) {
      const latestProximity = this.proximities[this.proximities.length - 1].value;
      if (latestProximity > this.proximityOffset) {
        this.proximityNotifications.push({
          type: 'Proximity',
          message: `Proximity value (${latestProximity}) exceeded offset (${this.proximityOffset})!`,
          timestamp: new Date().toLocaleString()
        });
      }
    }

    // Check the latest light value
    if (this.lights.length > 0) {
      const latestLight = this.lights[this.lights.length - 1].value;
      if (latestLight > this.lightOffset) {
        this.lightNotifications.push({
          type: 'Light',
          message: `Light value (${latestLight}) exceeded offset (${this.lightOffset})!`,
          timestamp: new Date().toLocaleString()
        });
      }
    }
    console.log('Humidity Notifications:', this.humidityNotifications);
    console.log('Temperature Notifications:', this.temperatureNotifications);
    console.log('Proximity Notifications:', this.proximityNotifications);
    console.log('Light Notifications:', this.lightNotifications);
  }


  hasNotifications(): boolean {
    return (
      (this.selectedChart === 'Chart1' && this.humidityNotifications.length > 0) ||
      (this.selectedChart === 'Chart2' && this.temperatureNotifications.length > 0) ||
      (this.selectedChart === 'Chart3' && this.proximityNotifications.length > 0) ||
      (this.selectedChart === 'Chart4' && this.lightNotifications.length > 0)
    );
  }

  clearNotifications(): void {
    switch (this.selectedChart) {
      case 'Chart1':
        this.humidityNotifications = [];
        break;
      case 'Chart2':
        this.temperatureNotifications = [];
        break;
      case 'Chart3':
        this.proximityNotifications = [];
        break;
      case 'Chart4':
        this.lightNotifications = [];
        break;
      default:
        break;
    }
  }





}