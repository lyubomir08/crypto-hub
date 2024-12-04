import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-crypto',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './edit-crypto.component.html',
    styleUrl: './edit-crypto.component.css'
})
export class EditCryptoComponent implements OnInit {

    ngOnInit(): void {
        
    }

    editCrypto() { }
}
