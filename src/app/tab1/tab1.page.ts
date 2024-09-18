import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  Devices: any[] = [];
  selectedDevice: any = null;
  isScanning: boolean = false; // Variable para manejar el estado de escaneo

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    console.log('ngOnInit');
    // this.enableBluetooth();
  }

  //*Activar el bluetooth
  async enableBluetooth() {
    return this.bluetoothSerial.isEnabled().then((response) => {
      if (response) {
        // this.isEnableBluetooth('BLE is enabled');
        console.log('BLE is enabled');
        return this.listDevices();
      } else {
        this.isEnableBluetooth('BLE is disabled');
        // return this.bluetoothSerial.enable();
        return Promise.resolve();
      }
    });
  }

  //* Listar dispositivos
  async listDevices() {
    this.bluetoothSerial.list().then(
      (response) => {
        console.log(response);
        this.Devices = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //*isEnableBluetooth
  async isEnableBluetooth(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'alerta',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK');
          },
        },
      ],
    });
  }

  //* Conectar dispositivo
  async connect(address: string) {
    this.bluetoothSerial.connect(address).subscribe(
      (response) => {
        console.log(response);
        this.deviceConnected();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deviceConnected() {
    this.bluetoothSerial.subscribe('\n').subscribe(
      (success) => {
        console.log(success);
        this.hundler(success);
      },
      (error) => {
        console.log(error);
        this.hundler(error);
      }
    );
  }

  //* enviar datos

  sendData(data: string) {
    this.bluetoothSerial.write(data).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //* disconectar dispositivo
  disconnect() {
    this.bluetoothSerial.disconnect().then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  hundler(value: any) {
    console.log(value);
  }
}
