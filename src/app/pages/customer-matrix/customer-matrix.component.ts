import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CustomerMatrixRecord {
  shipToName: string;
  shipToAddress1: string;
  shipToCity: string;
  shipToState: string;
  shipToZip: string;
  accountType: string;
  bpNumberIcs: string;
  npiAccredo: string;
}

@Component({
  selector: 'app-customer-matrix',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-matrix.component.html',
  styleUrl: './customer-matrix.component.scss'
})
export class CustomerMatrixComponent {

  records: CustomerMatrixRecord[] = [
    { shipToName: 'AARON JEREMY MILBANK MD',        shipToAddress1: '6025 LAKE RD',                  shipToCity: 'WOODBURY',     shipToState: 'MN', shipToZip: '55125', accountType: 'ICS',     bpNumberIcs: '510182311',  npiAccredo: ''           },
    { shipToName: 'ACCREDO HEALTH GROUP INC',        shipToAddress1: '1620 CENTURY CENTER PARKWAY',   shipToCity: 'MEMPHIS',      shipToState: 'TN', shipToZip: '38134', accountType: 'Accredo', bpNumberIcs: '',           npiAccredo: '1234567890' },
    { shipToName: 'ADENA REGIONAL MED CNTR ADENA',  shipToAddress1: '4435 SR 159',                   shipToCity: 'CHILLICOTHE',  shipToState: 'OH', shipToZip: '45601', accountType: 'ICS',     bpNumberIcs: '510184432',  npiAccredo: ''           },
    { shipToName: 'ADVANCED MGMT SOLUTIONS WARE',   shipToAddress1: '3435 BRECKINRIDGE BLVD',        shipToCity: 'DULUTH',       shipToState: 'GA', shipToZip: '30096', accountType: 'ICS',     bpNumberIcs: '510181600',  npiAccredo: ''           },
    { shipToName: 'ADVANCED UROLOGY ATRIUM HEALTH', shipToAddress1: '144 POOLE RD',                  shipToCity: 'LELAND',       shipToState: 'NC', shipToZip: '28451', accountType: 'ICS',     bpNumberIcs: '510183414',  npiAccredo: ''           },
    { shipToName: 'ADVANCED UROLOGY PLLC',          shipToAddress1: '10535 PARK MEADOWS BLVD',       shipToCity: 'LONE TREE',    shipToState: 'CO', shipToZip: '80124', accountType: 'ICS',     bpNumberIcs: '510182823',  npiAccredo: ''           },
    { shipToName: 'AFFAN ZAFAR',                    shipToAddress1: '3030 WATERVIEW PKWY',           shipToCity: 'RICHARDSON',   shipToState: 'TX', shipToZip: '75080', accountType: 'Accredo', bpNumberIcs: '',           npiAccredo: '1669822136' },
    { shipToName: 'ALAN CARNES, JR',                shipToAddress1: '1150 GOLDEN WAY',               shipToCity: 'WATKINSVILLE', shipToState: 'GA', shipToZip: '30677', accountType: 'Accredo', bpNumberIcs: '',           npiAccredo: '1295140747' },
    { shipToName: 'ALBERT GESKIN',                  shipToAddress1: '2790 MOSSIDE BLVD',             shipToCity: 'MONROEVILLE',  shipToState: 'PA', shipToZip: '15146', accountType: 'Accredo', bpNumberIcs: '',           npiAccredo: '1124556972' },
    { shipToName: 'ALLEGHENY HLTH NETWORK CANCER',  shipToAddress1: '81 WAGNER RD',                  shipToCity: 'MONACA',       shipToState: 'PA', shipToZip: '15061', accountType: 'ICS',     bpNumberIcs: '510184003',  npiAccredo: ''           },
    { shipToName: 'ALLINA HEALTH SYSTEM DBA',       shipToAddress1: '800 E 28TH ST',                 shipToCity: 'MINNEAPOLIS',  shipToState: 'MN', shipToZip: '55407', accountType: 'ICS',     bpNumberIcs: '510183265',  npiAccredo: ''           },
    { shipToName: 'AMERICAN ONC ARHSH HARMONY',     shipToAddress1: '133 HARMONY PARK CIR',          shipToCity: 'HOT SPRINGS',  shipToState: 'AR', shipToZip: '71913', accountType: 'ICS',     bpNumberIcs: '510184175',  npiAccredo: ''           },
    { shipToName: 'AMERICAN ONC TXCCO TEXAS',       shipToAddress1: '2130 W HOLOCOMBE BLVD 10TH FL', shipToCity: 'HOUSTON',      shipToState: 'TX', shipToZip: '77030', accountType: 'ICS',     bpNumberIcs: '510184667',  npiAccredo: ''           },
    { shipToName: 'AMP UROLOGY NH DOWN',            shipToAddress1: '2 ELLINWOOD DRIVE',             shipToCity: 'HARTFORD',     shipToState: 'NY', shipToZip: '13413', accountType: 'ICS',     bpNumberIcs: '510183439',  npiAccredo: ''           },
    { shipToName: 'AMP UROLOGY SYRACUSE',           shipToAddress1: '1226 EAST WATER STREEET',       shipToCity: 'SYRACUSE',     shipToState: 'NY', shipToZip: '13210', accountType: 'ICS',     bpNumberIcs: '510181595',  npiAccredo: ''           },
    { shipToName: 'ANIL V TUMKUR MD',               shipToAddress1: '1301 SUNSET DR STE 3',          shipToCity: 'JOHNSON CITY', shipToState: 'TN', shipToZip: '37604', accountType: 'Accredo', bpNumberIcs: '',           npiAccredo: '510183671'  },
    { shipToName: 'ANNE ARUNDEL UROLOGY PA',        shipToAddress1: '600 RIDGELY AVE',               shipToCity: 'ANNAPOLIS',    shipToState: 'MD', shipToZip: '21401', accountType: 'ICS',     bpNumberIcs: '510183247',  npiAccredo: ''           },
  ];
}
