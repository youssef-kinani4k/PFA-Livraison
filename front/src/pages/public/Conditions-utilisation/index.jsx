import { Footer, Header } from "../../../components/HeaderFooter";
import img1 from "../../../assets/Conditions d'utilisation.png";
import { Link } from "react-router-dom";

function Condition() {
  return (
    <>
      <Header />
      <div className="primary-bg py-5">
        <div className="container">
          <div className="row align-items-center">
            <img
              src={img1}
              alt="Équipe de livraison"
              className=" object-fit-cover d-none d-md-block col-md-4 order-md-2 justify-content-center align-items-center rounded-4 "
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display- fw-bold mb-3">
                Conditions Générales d’Utilisation
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">1. Objet de la plateforme</h4>
          <p>
            La plateforme NexWay a pour but de mettre en relation :
            <ul>
              <li>
                des clients souhaitant faire livrer des colis, documents ou
                marchandises,
              </li>
              <li>
                et des prestataires de livraison indépendants ou partenaires.
              </li>
            </ul>
            La société NexWay agit uniquement en tant qu’intermédiaire technique
            et commercial, et ne réalise aucun transport elle-même.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">2. Accès aux services</h4>
          <p>
            L’accès à nos services est ouvert à toute personne majeure,
            disposant de la capacité juridique, et acceptant les présentes CGU.
            Les utilisateurs peuvent accéder à la plateforme :
            <ul>
              <li>
                Via le site <Link to="/">NexWay</Link>
              </li>
              <li>Et/ou via l'application mobile (si applicable)</li>
            </ul>
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">3. Création de compte</h4>
          <p>
            Pour utiliser certaines fonctionnalités (réservation, suivi,
            facturation…), l’utilisateur doit créer un compte en fournissant des
            informations exactes et à jour. Chaque utilisateur est responsable
            de la confidentialité de ses identifiants. Toute activité réalisée
            via son compte est considérée comme étant effectuée par lui.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">4. Fonctionnement du service</h4>
          <p>
            <strong>a. Réservation :</strong> L’utilisateur sélectionne un
            service de livraison via la plateforme. Le choix du prestataire et
            du mode de livraison (standard, express, etc.) lui appartient.
          </p>
          <p>
            <strong>b. Paiement :</strong> Les paiements sont réalisés via une
            solution sécurisée. La Société perçoit une commission ou un frais de
            service clairement indiqué avant validation.
          </p>
          <p>
            <strong>c. Livraison :</strong> La livraison est assurée par le
            transporteur choisi. La responsabilité de l’exécution, des retards,
            pertes ou dommages incombe au prestataire.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">5. Tarifs</h4>
          <p>
            Les prix affichés incluent :
            <ul>
              <li>Le tarif du transporteur</li>
              <li>Les frais de service (le cas échéant)</li>
            </ul>
            La Société se réserve le droit de modifier ses tarifs à tout moment,
            sans impact sur les commandes déjà validées.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">6. Responsabilité</h4>
          <p>
            NexWay ne saurait être tenue responsable :
            <ul>
              <li>
                Des retards ou erreurs de livraison imputables au transporteur
              </li>
              <li>Des dommages causés aux colis</li>
              <li>Des pertes ou vols pendant le transport</li>
            </ul>
            Cependant, nous mettons tout en œuvre pour accompagner les
            utilisateurs dans la gestion de litiges avec les transporteurs.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center  flex-column">
          <h4 className="align-self-start">7. Obligations de l’utilisateur</h4>
          <p>
            L’utilisateur s’engage à :
            <ul>
              <li>Ne pas envoyer de produits interdits ou dangereux</li>
              <li>
                Fournir des informations exactes (adresse, téléphone, contenu…)
              </li>
              <li>
                Respecter les conditions d’utilisation de chaque transporteur
              </li>
            </ul>
            Toute utilisation frauduleuse ou abusive du service entraînera la
            suspension immédiate du compte.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">8. Propriété intellectuelle</h4>
          <p>
            Tous les contenus présents sur la plateforme (textes, logo, design,
            logiciels, etc.) sont protégés par des droits de propriété
            intellectuelle appartenant à NexWay ou à ses partenaires. Toute
            reproduction ou usage sans autorisation est interdit.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">9. Données personnelles</h4>
          <p>
            La gestion des données personnelles est régie par notre{" "}
            <Link to="/politique">Politique de confidentialité</Link>. Nous nous
            engageons à respecter le RGPD et à garantir la protection de vos
            données.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center  flex-column">
          <h4 className="align-self-start">10. Suspension ou résiliation</h4>
          <p>
            La Société peut suspendre ou supprimer l’accès à un utilisateur en
            cas de :
            <ul>
              <li>Non-respect des CGU</li>
              <li>Fraude ou tentative de fraude</li>
              <li>Activité illicite via la plateforme</li>
            </ul>
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">11. Modification des CGU</h4>
          <p>
            La Société se réserve le droit de modifier les présentes CGU à tout
            moment. En cas de mise à jour, les utilisateurs en seront informés
            via la plateforme. L’utilisation continue du service vaut
            acceptation des nouvelles conditions.
          </p>
        </div>

        <div className="w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className="align-self-start">12. Droit applicable et litiges</h4>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige,
            une tentative de résolution amiable sera privilégiée. À défaut, les
            tribunaux compétents seront ceux du siège de la société.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Condition;
