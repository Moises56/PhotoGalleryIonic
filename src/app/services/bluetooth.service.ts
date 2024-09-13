import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController
  ) {}

  // Escanear dispositivos Bluetooth
  scanDevices() {
    return this.bluetoothSerial.list(); // Devuelve una lista de dispositivos emparejados
  }
  // Conectar a un dispositivo
  connectToDevice(address: string) {
    return this.bluetoothSerial.connect(address);
  }

  // Enviar datos al dispositivo Bluetooth
  sendData(data: string) {
    return this.bluetoothSerial.write(data);
  }

  // Mostrar alertas al usuario
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
