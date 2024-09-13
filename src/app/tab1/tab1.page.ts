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
  isScanning: boolean = false; // Variable para manejar el estado de escaneo

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit() {
    this.scanForDevices();
  }

  // Función para escanear dispositivos Bluetooth cuando se presiona el botón
  scanForDevices() {
    this.isScanning = true; // Cambia el estado de escaneo a true
    this.bluetoothService.scanDevices().then(
      (devices) => {
        this.devices = devices;
        this.isScanning = false; // Cambia el estado de escaneo a false cuando termina
      },
      (err) => {
        this.isScanning = false; // Cambia el estado de escaneo a false si hay un error
        this.bluetoothService.showAlert(
          'Error',
          'No se pudo escanear dispositivos'
        );
      }
    );
  }

  connect(device: { address: string; name: any }) {
    this.bluetoothService.connectToDevice(device.address).subscribe(
      () => {
        this.selectedDevice = device;
        this.bluetoothService.showAlert(
          'Conectado',
          `Conectado a ${device.name}`
        );
      },
      (err) => {
        this.bluetoothService.showAlert(
          'Error',
          'No se pudo conectar al dispositivo'
        );
      }
    );
  }

  sendInvoiceData() {
    const invoiceData = 'Factura: Detalles de la factura...';
    this.bluetoothService.sendData(invoiceData).then(
      () => {
        this.bluetoothService.showAlert(
          'Enviado',
          'Factura enviada correctamente'
        );
      },
      (err) => {
        this.bluetoothService.showAlert(
          'Error',
          'No se pudo enviar la factura'
        );
      }
    );
  }
}
