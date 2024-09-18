import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  Devices: any[] = [];
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController
  ) {}

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
  async connectDevice(address: string) {
    this.bluetoothSerial.connect(address).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
