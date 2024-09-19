import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  Devices: any[] = [];
  connectedDevice: any = null;
  isConnecting: boolean = false;
  permissionsGranted: boolean = false;
  private invoiceCounter: number = 1; // Correlativo para las facturas

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private androidPermissions: AndroidPermissions
  ) {}

  //* Solicitar permisos en tiempo de ejecución
  async requestBluetoothPermissions() {
    if (this.permissionsGranted) {
      return;
    }

    const permissions = [
      this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
      this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    ];

    try {
      const result = await this.androidPermissions.requestPermissions(
        permissions
      );
      if (result.hasPermission) {
        this.permissionsGranted = true;
        this.showToast('Permisos concedidos');
      } else {
        this.showAlert('Error', 'No se concedieron los permisos necesarios');
      }
    } catch (error) {
      this.showAlert('Error', 'Error al solicitar permisos');
    }
  }

  //* Función para habilitar Bluetooth
  async enableBluetooth() {
    try {
      const isEnabled = await this.bluetoothSerial.isEnabled();
      if (!isEnabled) {
        await this.bluetoothSerial.enable();
        this.showToast('Bluetooth habilitado');
      }
    } catch (error) {
      this.showAlert('Error', 'No se pudo habilitar el Bluetooth');
    }
  }

  //* Función para escanear dispositivos Bluetooth
  async scanDevices(): Promise<any[]> {
    try {
      const devices = await this.bluetoothSerial.discoverUnpaired();
      this.Devices = devices;
      this.showToast('Dispositivos encontrados');
      return devices;
    } catch (error) {
      this.showAlert('Error', 'No se pudieron escanear los dispositivos');
      return [];
    }
  }

  //* Función para conectar a un dispositivo
  async connectDevice(address: string) {
    try {
      this.isConnecting = true;
      const result = await this.bluetoothSerial.connect(address).subscribe();
      this.connectedDevice = result;
      this.showToast('Dispositivo conectado');
    } catch (error) {
      this.showAlert('Error', 'No se pudo conectar al dispositivo');
    } finally {
      this.isConnecting = false;
    }
  }

  //* Función para imprimir la factura
  async printInvoice() {
    if (!this.connectedDevice) {
      this.showAlert('Error', 'No hay ningún dispositivo conectado');
      return;
    }

    // Datos de prueba para la factura
    const marketName = 'Supermercado ABC';
    const localName = 'Local 123';
    const ownerName = 'Juan Pérez';
    const amount = '150.00 USD';
    const concept = 'Compra de productos';
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const invoiceNumber = this.invoiceCounter;

    // Formato de la factura a enviar a la impresora
    const invoice = `
      ${marketName}
      ${localName}
      Propietario: ${ownerName}
      -------------------------------
      Concepto: ${concept}
      Monto a pagar: ${amount}
      Fecha: ${date}   Hora: ${time}
      Factura N°: ${invoiceNumber}
      -------------------------------
      Gracias por su compra!
    `;

    try {
      // Enviar la factura a la impresora
      await this.bluetoothSerial.write(invoice);
      this.showToast('Factura enviada a la impresora');
      this.invoiceCounter++; // Incrementar el correlativo de la factura
    } catch (error) {
      this.showAlert('Error', 'No se pudo enviar la factura a la impresora');
    }
  }

  //* Función para mostrar una alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //* Función para mostrar un mensaje tipo toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  //* Función para obtener el dispositivo conectado
  getConnectedDevice() {
    return this.connectedDevice;
  }
}
