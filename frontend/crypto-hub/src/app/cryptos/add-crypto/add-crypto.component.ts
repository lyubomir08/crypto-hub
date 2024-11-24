import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-crypto',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './add-crypto.component.html',
    styleUrl: './add-crypto.component.css'
})
export class AddCryptoComponent {

    create(form: NgForm) {
        if (form.invalid) {
            console.error("Invalid create form");
            return;
        }
        
    }
}
