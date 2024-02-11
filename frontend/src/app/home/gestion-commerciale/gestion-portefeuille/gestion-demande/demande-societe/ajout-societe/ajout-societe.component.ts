import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../../../model/Branche';
import { Categorie } from '../../../../../../model/Categorie';
import { Civilite } from '../../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../../model/ClassificationSecteur';
import { Client } from '../../../../../../model/Client';
import { Contact } from '../../../../../../model/Contact';
import { Produit } from '../../../../../../model/Produit';
import { Prospect } from '../../../../../../model/Prospect';
import { User } from '../../../../../../model/User';
import { BrancheService } from '../../../../../../services/branche.service';
import { CategorieService } from '../../../../../../services/categorie.service';
import { ClassificationSecteurService } from '../../../../../../services/classification-secteur.service';
import { ClientService } from '../../../../../../services/client.service';
import { ContactService } from '../../../../../../services/contact.service';
import { DemandesocieteService } from '../../../../../../services/demandesociete.service';
import { FormatNumberService } from '../../../../../../services/formatNumber.service';
import { ProduitService } from '../../../../../../services/produit.service';
import { ProspectService } from '../../../../../../services/prospect.service';
import { UserService } from '../../../../../../services/user.service';
import type from '../../../../../data/type.json';
import { saveAs } from 'file-saver';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'ngx-ajout-societe',
  templateUrl: './ajout-societe.component.html',
  styleUrls: ['./ajout-societe.component.scss']
})
export class AjoutSocieteComponent implements OnInit {

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login:any;
  user: User;

  listTypes: any [];
  @Input() listTypeSocite:any [] = type;

  public dataSource = new MatTableDataSource<Contact>();
  classifications: ClassificationSecteur[];

  produit :Produit ;
  produits : Array<Produit> = new Array<Produit>();
  listProduits: any [];
  societe: any = "";
  activite: any= "";

  client :Client ;
  clients : Array<Client> = new Array<Client>();
  
  autorisation: [];

  contacts: Array<Contact> = new Array<Contact>();
  contactsP: Array<Contact> = new Array<Contact>();
  contact: Contact;
  prospect :Prospect ;
  prospects : Array<Prospect> = new Array<Prospect>();
  titulaireClient: boolean;
  societe_type: any;
contactSoci: any;
verifContact: boolean = false;
  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;
  errorMobile: boolean;
  errorEmailDG: boolean;
  selec: String ="toto";

  mendataire: any;
  
 formatMontant: Number;
 formatMontant2: Number;
 formatMontant3: Number;

  displayErrorEmail: boolean = false;
  displayErrorEmailDG: boolean = false;
  displayErrorNumero: boolean = false;  
  displayErrorNumero2: boolean = false;  
  displayErrorMobile: boolean = false;
  displaytitulaire: boolean = false;

  displaytype: boolean= false;

  numCategorie:any;
  numBranch:any;
  numProduit1:any;
  numProduit2:any;
  numProduit3:any;
  numCategChoisi: number;
  
  listeCodeBranche: any[];
  listeNumeroCategorie: any[];
  listeCodeProduit: any[];
  branches: Array<Branche> = new Array<Branche>();
  categories: Array<Categorie> = new Array<Categorie>();

  addForm = this.fb.group({
    dem_socnum: [''],
    dem_denomination: ['',[Validators.required]],
    dem_typetitulaire: ['',[Validators.required]],
    dem_clienttitulaire: ['',[Validators.required]],
    dem_typesociete: ['',[Validators.required]],
    dem_capitalsocial: ['',[Validators.required]],
    dem_nomprenomsdg: [''],
    dem_adresse1: ['',[Validators.required]],
    dem_adresse2: [''],
    dem_ville: ['',[Validators.required]],
    dem_secteuractivites: [''],
    dem_registrecommerce: ['',[Validators.required]],
    dem_ninea: ['',[Validators.required]],
    dem_comptebancaire: [''],
    dem_telephoneprincipal: ['', [Validators.required]],
    dem_telephone2: [''],
    dem_telephonemobile: ['', [Validators.required]],
    dem_siteinternet: [''],
    dem_emailsociete: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    dem_emaildirigeant: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    dem_contactsociete: [''],
    dem_objetdemande: [''],
    dem_produitdemande1: ['', [Validators.required]],
    dem_produitdemande2: [''],
    dem_produitdemande3: [''],
    dem_soumissionarbitrage: ['', [Validators.required]],
    dem_codeutilisateur: [''],
    dem_datemodification: [''],
    dem_statut: [''],
    dem_categorie: ['', [Validators.required]],
    dem_branch : ['', [Validators.required]],
    dem_montant: ['', [Validators.required]],
    dem_marche: [''],
    dem_montant2: [''],
    dem_montant3: ['']
    
  });

  // ================ Déclarations des variables pour la recherche avec filtre ======================
 clientss: Array<Client> = new Array<Client>();
 prospectss: Array<Prospect> = new Array<Prospect>();
 classificationss: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
 branchess: Array<Branche> = new Array<Branche>();
 categoriess: Array<Categorie> = new Array<Categorie>();
 produitss: Array<Produit> = new Array<Produit>();
 contactss: Array<Contact> = new Array<Contact>();

 /** control for the selected  */
 public clientsCtrl: FormControl = new FormControl();
 public prospectCtrl: FormControl = new FormControl();
 public classifCtrl: FormControl = new FormControl();
 public brancheCtrl: FormControl = new FormControl();
 public categorieCtrl: FormControl = new FormControl();
 public produitCtrl: FormControl = new FormControl();
 public contactCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 public clientsFilterCtrl: FormControl = new FormControl();
 public prospectFilterCtrl: FormControl = new FormControl();
 public classifFilterCtrl: FormControl = new FormControl();
 public brancheFilterCtrl: FormControl = new FormControl();
 public categorieFilterCtrl: FormControl = new FormControl();
 public produitFilterCtrl: FormControl  = new FormControl();
 public contactFilterCtrl: FormControl  = new FormControl();

 /** list  filtered by search keyword */
 public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
 public filteredProspect: ReplaySubject<Prospect[]> = new ReplaySubject<Prospect[]>();
 public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();
 public filteredBranche: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
 public filteredCategorie: ReplaySubject<Categorie[]> = new ReplaySubject<Categorie[]>();
 public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
 public filteredContact: ReplaySubject<Contact[]> = new ReplaySubject<Contact[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================
  constructor(
    private fb: FormBuilder,
    private authService: NbAuthService,private demSocService: DemandesocieteService,
    private toastrService: NbToastrService,private router: Router,
    private userService: UserService,private produitService: ProduitService,
    private classifService: ClassificationSecteurService,private clientService: ClientService,
    private prospectService: ProspectService, private contactService: ContactService,
    private categorieService: CategorieService, private brancheService: BrancheService,
    private formatNumberService: FormatNumberService){

    }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
//console.log(this.onGetContact(1));
    this.listTypes=this.listTypeSocite['TYPE_SOCIETE'];
    this.getlogin();
    this.onGetAllProduit();
   this.addForm.controls['dem_capitalsocial'].setValue(0);
   this.onGetClassification();
   this.onGetAllBranches();
  
   // =================== Listen for search field value changes =======================
  this.clientsFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterClients();
  });

  this.prospectFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterProspects();
  });
  this.brancheFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBranches();
      });

      this.classifFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClassifs();
      });

      this.categorieFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategories();
      });
      this.produitFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProduits();
      });
      this.contactFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterContacts();
      });
}

ngOnDestroy() {
 this._onDestroy.next();
 this._onDestroy.complete();
}
protected filterContacts() {
  if (!this.contactss) {
    return;
  }
  // get the search keyword
  let search = this.contactFilterCtrl.value;
  if (!search) {
    this.filteredContact.next(this.contactss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredContact.next(
    this.contactss.filter(c => c.cont_nom.toLowerCase().indexOf(search) > -1 ||
    c.cont_prenom.toLowerCase().indexOf(search) > -1 )
  );
}
protected filterProduits() {
  if (!this.produitss) {
    return;
  }
  // get the search keyword
  let search = this.produitFilterCtrl.value;
  if (!search) {
    this.filteredProduit.next(this.produitss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProduit.next(
    this.produitss.filter(p => p.prod_denominationlong.toLowerCase().indexOf(search) > -1 ||
    p.prod_numero.toString().indexOf(search) > -1 )
  );
}
protected filterCategories() {
  if (!this.categoriess) {
    return;
  }
  // get the search keyword
  let search = this.categorieFilterCtrl.value;
  if (!search) {
    this.filteredCategorie.next(this.categoriess.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCategorie.next(
    this.categoriess.filter(cat => cat.categ_libellecourt.toLowerCase().indexOf(search) > -1)
  );
}
protected filterBranches() {
  if (!this.branchess) {
    return;
  }
  // get the search keyword
  let search = this.brancheFilterCtrl.value;
  if (!search) {
    this.filteredBranche.next(this.branchess.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredBranche.next(
    this.branchess.filter(b => b.branche_libelleLong.toLowerCase().indexOf(search) > -1)
  );
}
protected filterClassifs() {
  if (!this.classificationss) {
    return;
  }
  // get the search keyword
  let search = this.classifFilterCtrl.value;
  if (!search) {
    this.filteredClassif.next(this.classificationss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredClassif.next(
    this.classificationss.filter(classif => classif.libelle.toLowerCase().indexOf(search) > -1)
  );
}
protected filterClients() {
 console.log(this.clientss.filter(cl => cl.clien_nom));
 if (!this.clientss) {
   return;
 }
 
 // get the search keyword
 let search = this.clientsFilterCtrl.value;
 if (!search) {
   this.filteredClients.next(this.clientss.slice());
   return;
 } else {
   search = search.toLowerCase();
 }
 this.filteredClients.next(
   this.clientss.filter(cl => cl?.clien_prenom.toLowerCase().indexOf(search) > -1 ||
    cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_denomination?.toLowerCase().indexOf(search) > -1|| 
    cl.clien_numero?.toString().indexOf(search) > -1
   )
   
 );
}
protected filterProspects() {
  if (!this.prospectss) {
    return;
  }
  
  // get the search keyword
  let search = this.prospectFilterCtrl.value;
  if (!search) {
    this.filteredProspect.next(this.prospectss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProspect.next(
    this.prospectss.filter(
    p => p.prospc_prenom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_denomination.toLowerCase().indexOf(search)> -1 ||
     p.prospc_nom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_sigle.toLowerCase().indexOf(search)> -1 ||
     p.prospc_numero.toString().indexOf(search)> -1
    
    )    
  );
 }
// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================
onGetAllBranches(){
  this.brancheService.getAllBranches()
  .subscribe((data: Branche[]) => {
    this.branchess = data as Branche[];      
    this.filteredBranche.next(this.branchess.slice());
  });
}
  
  
onGetAllCategorieByBranche(branche: number){
  this.categorieService.getAllCategorieBranche(branche)
  .subscribe((data: Categorie[]) => {
    this.categoriess = data as Categorie[];      
    this.filteredCategorie.next(this.categoriess.slice());
  });
}
onGetAllProduitByCategorie(categorie: number){
  this.produitService.getAllProduitByCategorie(categorie)
    .subscribe((data: Produit[]) => {
    this.produitss = data as Produit[];      
    this.filteredProduit.next(this.produitss.slice());
  });
}
  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event.value);
    this.addForm.controls['dem_branch'].setValue(event.value);
    this.categorieCtrl.setValue("");
    this.produitCtrl.setValue("");
    
    this.addForm.controls['dem_objetdemande'].setValue(""); 
    if(event.value == '15'){
      this.displaytype= true;
      this.addForm.controls['dem_marche'].setValidators(Validators.required);
      
    } else{
      this.addForm.controls['dem_marche'].clearValidators();
      this.addForm.controls['dem_marche'].setValue("");
      this.displaytype= false;
      
    }
       
    this.addForm.controls['dem_marche'].updateValueAndValidity();
console.log(event.value);
    /* this.numCategorie = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.numProduit1 = "".toString();
    this.addForm.controls['dem_categorie'].setValue(this.numCategorie);
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3); */
  }
  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event.value);
    console.log(event.value);
    this.numCategChoisi = event.value;
    this.addForm.controls['dem_categorie'].setValue(event.value);
    this.produitCtrl.setValue("");
    this.addForm.controls['dem_objetdemande'].setValue(""); 
    /* this.numProduit1 = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3); */
  }
  onFocusOutEventMontant() {
    
    // tslint:disable-next-line:max-line-length
    this.formatMontant = Number(this.formatNumberService.replaceAll((this.addForm.get("dem_montant").value),' ',''));
    console.log( this.formatMontant);
    if (this.formatMontant !=null){
  
      console.log( this.formatNumberService.numberWithCommas2( this.formatMontant));
  
     // tslint:disable-next-line:max-line-length
     this.addForm.controls['dem_montant'].setValue(this.formatNumberService.numberWithCommas2( this.formatMontant));
    }
    
  }
  onFocusOutEventMontant2() {
    
    // tslint:disable-next-line:max-line-length
    this.formatMontant2 = Number(this.formatNumberService.replaceAll((this.addForm.get("dem_montant2").value),' ',''));
    console.log( this.formatMontant2);
    if (this.formatMontant2 !=null){
  
      console.log( this.formatNumberService.numberWithCommas2( this.formatMontant2));
  
     // tslint:disable-next-line:max-line-length
     this.addForm.controls['dem_montant2'].setValue(this.formatNumberService.numberWithCommas2( this.formatMontant2));
    }
    
  }
  onFocusOutEventMontant3() {
    
    // tslint:disable-next-line:max-line-length
    this.formatMontant3 = Number(this.formatNumberService.replaceAll((this.addForm.get("dem_montant3").value),' ',''));
    console.log( this.formatMontant3);
    if (this.formatMontant3 !=null){
  
      console.log( this.formatNumberService.numberWithCommas2( this.formatMontant3));
  
     // tslint:disable-next-line:max-line-length
     this.addForm.controls['dem_montant3'].setValue(this.formatNumberService.numberWithCommas2( this.formatMontant3));
    }
    
  }
  onChangeMarcher(event){
    console.log(event.target.value);
this.addForm.controls['dem_marche'].setValue(event.target.value);
}

  onChange(event){
    this.addForm.controls['dem_typetitulaire'].setValue(event);
  }
  onChangeActivite(event){
    this.addForm.controls['dem_secteuractivites'].setValue(event.value);
  }
  
  onGetClassification(){
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classificationss = data as ClassificationSecteur[];
        this.filteredClassif.next(this.classificationss.slice());
      })
  }
  onGetContactPros(){
    this.contactService.getAllMandataires()
    .subscribe((data: Contact[]) => {
      this.contactsP = data as Contact[];
      
      this.dataSource.data = data as Contact[];
      console.log(this.selec);
    });
  }/*
  onGetContact(id: number){
    this.contactService.allMandataireByClient(id)
    .subscribe((data: Contact[]) => {
      this.contacts = data as Contact[];
      this.selec=data[0]?.cont_prenom +' '+data[0]?.cont_nom ;
      
     //this.addForm.controls['dem_contactsociete'].setValue(data[0].cont_numero);
     //this.onChangeContact(data[0].cont_numero);
      this.dataSource.data = data as Contact[];
      console.log(this.selec);
    });
  }*/
  onGetContact(id: number){
    this.contactService.allMandataireByClient(id)
    .subscribe((data: Contact[]) => {
        this.contactss = data as Contact[];
        this.filteredContact.next(this.contactss.slice());
        this.selec=data[0]?.cont_prenom +' '+data[0]?.cont_nom ;
        this.dataSource.data = data as Contact[];

      })
  }
  onChangeContact(event){
    this.addForm.controls['dem_contactsociete'].setValue(event);
    //this.onGetContact(event);
    //this.onGetContact(event);
  }

  onchangeMailSociete () {
    this.displayErrorEmail = true;
    if(this.addForm.controls['dem_emailsociete'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeMailDirigeant () {
    this.displayErrorEmailDG = true;
    if(this.addForm.controls['dem_emaildirigeant'].valid == true ){
      this.errorEmailDG = true;
    }else{
      this.errorEmailDG = false;
    }
  }
  onchangeNumero () {
    this.displayErrorNumero = true;
    if(this.addForm.controls['dem_telephoneprincipal'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayErrorNumero2 = true;
    if(this.addForm.controls['dem_telephone2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }
  onchangeMobile () {
    this.displayErrorMobile = true;
    if(this.addForm.controls['dem_telephonemobile'].valid == true ){
      this.errorMobile = true;
    }else{
      this.errorMobile = false;
    }
  }

  onGetClent(){
    this.clientService.getAllClientMorale()
    .subscribe((data: Client[]) => {
      this.clientss = data as Client[];      
      this.filteredClients.next(this.clientss.slice());
    });
    console.log(this.clientss)
  }
  onGetProspect(){
    this.prospectService.getAllProspectMorale()
    .subscribe((data: Prospect[]) => {
      this.prospectss = data as Prospect[];
      this.filteredProspect.next(this.prospectss.slice());
    });
  }/*
onChangeTitulaire(event){
        this.addForm.controls['dem_clienttitulaire'].setValue(event);
      }
  
  onChangeTypeClient(event){
    this.addForm.controls['dem_typetitulaire'].setValue(event);

    if(event==="CL"){
      this.titulaireClient=true;
      this.onGetClent();
      console.log("mogui fiii");
    }else if(event==="PR")
    {
      this.titulaireClient=false;
      this.onGetProspect();
      console.log("mogui");
    }


if(data.message == "liste vide" ){
            this.leader= 'true';
            this.onChange(true);
            this.addForm.controls['cont_leader'].disable();
          }else{
            this.leader= '';
            this.addForm.controls['cont_leader'].enable();
          }

  }*/
  onChangeTitulaire(event){
    this.addForm.controls['dem_clienttitulaire'].setValue(event.value);
    console.log(event.value);
    console.log(this.addForm.controls['dem_typetitulaire'].value);
    console.log((this.clientss.find(p => p.clien_numero == event.value))?.clien_titre);
    this.mendataire = "".toString();
    this.addForm.controls['dem_contactsociete'].setValue(this.mendataire);
    if(this.addForm.controls['dem_typetitulaire'].value==="CL"){
      this.displaytitulaire=true;
      console.log("client");
      this.addForm.controls['dem_typesociete'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_typesociete);
      this.societe = this.onGetLibelleByType(((this.clientss.find(p => p.clien_numero == event.value))?.clien_typesociete)?.toString());
      console.log(this.societe);
      console.log(((this.clientss.find(p => p.clien_numero == event.value))?.clien_typesociete));
      this.addForm.controls['dem_denomination'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_denomination);
      this.addForm.controls['dem_registrecommerce'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_registrecommerce);
      
      this.addForm.controls['dem_ninea'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_ninea);
      this.addForm.controls['dem_emailsociete'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_email);        
      this.addForm.controls['dem_telephoneprincipal'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_telephone1);
      this.addForm.controls['dem_telephone2'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_telephone2);
      this.addForm.controls['dem_ville'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adresseville);
      this.addForm.controls['dem_telephonemobile'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_portable);
      this.addForm.controls['dem_secteuractivites'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_secteur_activite);
      this.activite=this.onGetLibelleBySectActivite((this.clientss.find(p => p.clien_numero == event.value))?.clien_secteur_activite);
      console.log(this.activite);
      console.log(this.contactSoci);
      this.verifContact= true;
    this.onGetContact(event.value);
    this.addForm.controls['dem_adresse1'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adressenumero);
    this.addForm.controls['dem_adresse2'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adresserue);
    this.addForm.controls['dem_nomprenomsdg'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_princdirigeant);
      console.log((this.clientss.find(p => p.clien_numero == event.value))?.clien_princdirigeant);
      //this.addForm.controls['dem_contactsociete'].setValue(this.contactSoci);
      //console.log((this.clients.find(p => p.clien_numero === event))?.clien_typesociete);clien_princdirigeant
    }else if(this.addForm.controls['dem_typetitulaire'].value==="PR"){
      console.log("pr");
      this.displaytitulaire=false;
      this.addForm.controls['dem_typesociete'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_typesociete);
      this.societe= this.onGetLibelleByType((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_typesociete);
      this.addForm.controls['dem_denomination'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_denomination);
      this.addForm.controls['dem_registrecommerce'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_registrecommerce);
      this.addForm.controls['dem_ninea'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_ninea);
      this.addForm.controls['dem_emailsociete'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_email);
      this.addForm.controls['dem_telephoneprincipal'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone1);
      this.addForm.controls['dem_telephone2'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone2);
      this.addForm.controls['dem_telephonemobile'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_portable);
      this.addForm.controls['dem_siteinternet'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_website);
      this.addForm.controls['dem_adresse1'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adressenumero);
      this.addForm.controls['dem_adresse2'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adresserue);
      this.addForm.controls['dem_ville'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adresseville);
      this.addForm.controls['dem_nomprenomsdg'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_princdirigeant);
    this.onGetContactPros();
    console.log((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_princdirigeant);
    this.addForm.controls['dem_secteuractivites'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_classificationmetier);
    this.activite=this.onGetLibelleBySectActivite((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_classificationmetier);
   
    }
    //this.numCivilite= (this.clients.find(p => p.clien_numero == event))?.clien_titre;dem_comptebancaire
  }
  onGetLibelleBySectActivite(numero: any) {
    console.log(this.classificationss);
    console.log(numero + " : " + (this.classificationss?.find(b => b.code === numero))?.libelle);
    return numero + " : " + (this.classificationss?.find(b => b.code === numero))?.libelle;

  }
  onChangeTypeClient(event){
    this.addForm.controls['dem_typetitulaire'].setValue(event);

    if(event=="CL"){
      this.titulaireClient=true;
      this.onGetClent();
       this.societe=" ";
    this.mendataire = "".toString();
    this.addForm.controls['dem_contactsociete'].setValue(this.mendataire);
    this.addForm.controls['dem_denomination'].setValue(" ");        
    this.addForm.controls['dem_registrecommerce'].setValue(" ");        
    this.addForm.controls['dem_ninea'].setValue(" ");        
    this.addForm.controls['dem_emailsociete'].setValue(" ");        
    this.addForm.controls['dem_telephoneprincipal'].setValue(" ");        
    this.addForm.controls['dem_telephone2'].setValue(" ");        
    this.addForm.controls['dem_ville'].setValue(" ");        
    this.addForm.controls['dem_telephonemobile'].setValue(" ");
      //console.log((this.clients.find(p => p.clien_numero == event))?.clien_titre);
    
     //console.log("client");
    }else if(event=="PR")
    {
      this.titulaireClient=false;
    this.onGetProspect();
    this.mendataire = "".toString();
    this.societe=" ";
    this.addForm.controls['dem_contactsociete'].setValue(this.mendataire);
    this.addForm.controls['dem_typesociete'].setValue(" ");        
    this.addForm.controls['dem_denomination'].setValue(" ");            
    this.addForm.controls['dem_ninea'].setValue(" ");        
    this.addForm.controls['dem_emailsociete'].setValue(" ");           
    this.addForm.controls['dem_telephone2'].setValue(" ");        
    this.addForm.controls['dem_ville'].setValue(" ");        
 // console.log("prosper");
    }
  }
  onChangeArbitrage(event) {
    this.addForm.controls['dem_soumissionarbitrage'].setValue(event);
    if(event=='O'){
      this.addForm.controls['dem_statut'].setValue("validé pour arbitrage");
    }else if(event=='N'){
      this.addForm.controls['dem_statut'].setValue("contrat à émettre");
    }
  }
  onGetAllProduit(){
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
      this.produitss = data as Produit[];
      this.filteredProduit.next(this.produitss.slice());
    });
  }
  onChangeProiduit1(event) {
    //console.log(event); 
    this.numProduit1=event.value   ;
    this.addForm.controls['dem_produitdemande1'].setValue(event.value);

    
    this.addForm.controls['dem_objetdemande'].setValue((this.produitss.find(p => p.prod_numero == event.value))?.prod_denominationlong);
    //this.societe = this.onGetLibelleByType(((this.clientss.find(p => p.clien_numero == event.value))?.clien_typesociete)?.toString());
    console.log((this.produitss.find(p => p.prod_numero == event.value))?.prod_denominationlong);
    this.numProduit2="";
    this.numProduit3="";
  }
  onChangeProiduit2(event) {
    console.log(event.value);
    this.numProduit2=event.value
    this.addForm.controls['dem_objetdemande'].setValue("PRODUITS MULTIPLES");
    this.addForm.controls['dem_produitdemande2'].setValue(event.value);
    if(event.value != null){
      //this.displaytype= true;
      this.addForm.controls['dem_montant2'].setValidators(Validators.required);
      
    } else{
      this.addForm.controls['dem_montant2'].clearValidators();
      this.addForm.controls['dem_montant2'].setValue("");
      //this.displaytype= false;
      
    }
    this.numProduit3="";
  }
  onChangeProiduit3(event) {
    console.log(event.value);
    this.numProduit3 = event.value;
    this.addForm.controls['dem_produitdemande3'].setValue(event.value);
    if(event.value != null){
      //this.displaytype= true;
      this.addForm.controls['dem_montant3'].setValidators(Validators.required);
      
    } else{
      this.addForm.controls['dem_montant3'].clearValidators();
      this.addForm.controls['dem_montant3'].setValue("");
      //this.displaytype= false;
      
    }
  }
  onChangeLibeleType(event) {
    console.log(event);
    this.addForm.controls['dem_typesociete'].setValue((this.listTypes.find(p => p.id === event)).id);
  }
  onGetLibelleByType(numero: any) {
    
      return numero + " : " + (this.listTypes?.find(p =>  p.id  === numero))?.value;
  
    
    }
  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
      });
        }
      });
  }


      demandeEnvoye=false;
      submit() {
        //this.addForm.controls['dem_telephoneprincipal'].setValue(this.addForm.controls['dem_telephoneprincipal'].value.internationalNumber);
        //this.addForm.controls['dem_telephone2'].setValue(this.addForm.controls['dem_telephone2'].value?.internationalNumber);
        //this.addForm.controls['dem_telephonemobile'].setValue(this.addForm.controls['dem_telephonemobile'].value.internationalNumber);
        this.addForm.controls['dem_montant'].setValue(this.formatMontant);
        this.addForm.controls['dem_montant2'].setValue(this.formatMontant2);
        this.addForm.controls['dem_montant3'].setValue(this.formatMontant3);
        this.addForm.controls['dem_datemodification'].setValue(new Date());
        this.addForm.controls['dem_codeutilisateur'].setValue(this.user.util_numero);
        console.log(this.addForm.controls['dem_codeutilisateur'].value + ' ' + this.addForm.controls['dem_datemodification'].value);
        this.demSocService.addDemandeSociete(this.addForm.value)
          .subscribe((data:any) => {
            this.idDemande=data.data.dem_socnum;
            this.demandeEnvoye=true;
            // console.log(data.data.dem_persnum);
            this.toastrService.show(
              'Demande Physique Enregistré avec succes !',
              'Notification',
              {
                status: this.statusSuccess,
                destroyByClick: true,
                duration: 30000,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
              this.router.navigateByUrl('home/demande-societe');
          },
            (error) => {
              this.toastrService.show(
                error.error,
                'Notification d\'erreur',
                {
                  status: this.statusFail,
                  destroyByClick: true,
                  duration: 30000,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            },
          );
      }

      cancel() {
        this.router.navigateByUrl('home/demande-societe');
      }
      check_fonct(fonct: String) {
  
        let el = this.autorisation.findIndex(itm => itm === fonct);
        if (el === -1)
         return false;
        else
         return true;
    
      }
      displayButtonUpload =false;
      openAjout () {
        this.displayButtonUpload =true;
      }

      displayprogress: boolean = false;
      files: File[];
      selectedFile = null;
      idDemande:any;
      progress: number = 0;
      onFileSelected(event) {
        this.selectedFile = event.target.files;
        console.log(this.selectedFile);
      }
      
      onClickUpload() {
        this.displayprogress = true;
        this.files = this.selectedFile;
        const form = new FormData();
        for (const file of this.files) {
          form.append('files', file, file.name);
        }
    
        this.demSocService.uploadDoc(form, this.idDemande)
          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100);
                console.log(`Uploaded! ${this.progress}%`);
                break;
              case HttpEventType.Response:
                console.log('upload ok', event.status);
                setTimeout(() => {
                  this.progress = 0;
                  this.displayprogress = false;
                }, 1500);
                if (event.status == 200) {
                  this.ongetFiles();
                  this.toastrService.show(
                    'Upload reussi avec succes !',
                    'Notification',
                    {
                      status: this.statusSuccess,
                      destroyByClick: true,
                      duration: 0,
                      hasIcon: true,
                      position: this.position,
                      preventDuplicates: false,
                    });
                } else {
                  this.toastrService.show(
                    'une erreur est survenue',
                    'Notification',
                    {
                      status: this.statusFail,
                      destroyByClick: true,
                      duration: 0,
                      hasIcon: true,
                      position: this.position,
                      preventDuplicates: false,
                    });
                }
            }
    
          });
    
    
      }
      filenames: string[];
      ongetFiles() {
        this.demSocService.getFilesDoc(this.idDemande)
          .subscribe(data => this.filenames = data as string[]);
      }

      onClickDownload(filename: string) {
        this.demSocService.downloadDoc(filename, this.idDemande)
          .subscribe(event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100);
                console.log(`downloaded! ${this.progress}%`);
                break;
              case HttpEventType.Response:
                console.log(event.body);
                saveAs(event.body, filename);
            }
          });
      }
    
    
      onClickDelete(filename: string) {
        this.demSocService.deleteFileDoc(filename, this.idDemande)
          .subscribe(event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100);
                console.log(`downloaded! ${this.progress}%`);
                break;
              case HttpEventType.Response:
    
                if (event.status == 200) {
                  this.ongetFiles();
                  this.toastrService.show(
                    'Suppression reussi avec succes !',
                    'Notification',
                    {
                      status: this.statusSuccess,
                      destroyByClick: true,
                      duration: 0,
                      hasIcon: true,
                      position: this.position,
                      preventDuplicates: false,
                    });
                } else {
                  this.toastrService.show(
                    'une erreur est survenue',
                    'Notification',
                    {
                      status: this.statusFail,
                      destroyByClick: true,
                      duration: 0,
                      hasIcon: true,
                      position: this.position,
                      preventDuplicates: false,
                    });
                }
            }
          });
      }
    
    
}
