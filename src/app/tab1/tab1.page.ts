import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  devices: any[] = [];
  selectedDevice: any = null;
  isConnected: boolean = false;
  isConnecting: boolean = false;
  isScanning: boolean = false;

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit() {
    this.bluetoothService.enableBluetooth(); // Activar Bluetooth al iniciar
  }

  //* Escanear dispositivos
  async scanDevices() {
    this.isScanning = true;

    try {
      await this.bluetoothService.requestBluetoothPermissions();
      await this.bluetoothService.enableBluetooth();
      this.devices = await this.bluetoothService.scanDevices();
    } finally {
      this.isScanning = false;
    }
  }

  //* Conectar a un dispositivo
  async connect(device: any) {
    this.isConnecting = true;
    this.selectedDevice = device;

    try {
      await this.bluetoothService.connectDevice(device.address);
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
    } finally {
      this.isConnecting = false;
    }
  }

  //* Imprimir factura
  async printInvoice() {
    if (this.isConnected) {
      await this.bluetoothService.printInvoice(); // Llamada al servicio para imprimir
    } else {
      console.log('No hay ningún dispositivo conectado para imprimir');
    }
  }
}
