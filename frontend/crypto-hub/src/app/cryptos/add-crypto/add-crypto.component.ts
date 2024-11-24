import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-crypto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-crypto.component.html',
  styleUrl: './add-crypto.component.css'
})
export class AddCryptoComponent {

  create() {}
}
