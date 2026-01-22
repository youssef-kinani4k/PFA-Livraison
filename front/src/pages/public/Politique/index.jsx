import { Footer, Header } from "../../../components/HeaderFooter";
import img1 from "../../../assets/fonctionnaliter1.png";
import { Link } from "react-router-dom";

function Politique() {
  return (
    <>
      <Header />
      <div className="primary-bg py-5">
        <div className="container">
          <div className="row align-items-center">
            <img
              src={img1}
              alt="Équipe de livraison"
              className=" object-fit-cover d-none d-md-block col-md-4 order-md-2 justify-content-center align-items-center rounded-4 bg-dark-subtle"
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display-5 fw-bold mb-3">
                Politique de confidentialité
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className=" container mt-5 mb-5">
        <div className=" w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className=" align-self-start">1. Introduction</h4>
          <p>
            NexWay est une plateforme facilitant la mise en relation entre les
            clients et des prestataires de livraison professionnels. Nous ne
            réalisons pas directement les livraisons, mais nous nous engageons à
            sélectionner des partenaires fiables et à suivre le bon déroulement
            des services commandés via notre plateforme.
          </p>
        </div>
        <div className=" w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className=" align-self-start">2. Notre rôle</h4>
          <p>
            En tant qu’intermédiaire :
            <ul>
              <li>
                Nous facilitons la réservation d’un service de livraison auprès
                de nos partenaires.
              </li>
              <li>
                Nous transmettons les informations de livraison entre le client
                et le livreur.
              </li>
              <li>
                Nous assurons le suivi administratif et technique des demandes.
              </li>
            </ul>
            Nous ne sommes pas responsables du transport physique des colis,
            mais nous intervenons en cas de litige ou de problème.
          </p>
        </div>
        <div className=" w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className=" align-self-start">3. Suivi et assistance</h4>
          <p>
            Un lien de suivi vous est transmis dès que le transporteur le
            fournit. En cas de souci (retard, colis perdu, erreur de livraison),
            vous pouvez :
            <ul>
              <li>
                Contacter directement le transporteur concerné via les
                coordonnées fournies.
              </li>
              <li>
                Ou nous signaler le problème via notre service client : [email /
                formulaire].
              </li>
            </ul>
            Nous vous accompagnons dans les démarches de réclamation si
            nécessaire.
          </p>
        </div>
        <div className=" w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className=" align-self-start">4. Responsabilité</h4>
          <p>
            NexWay n’est pas responsable en cas de :
            <ul>
              <li>
                Perte, vol ou dégradation de colis (la responsabilité incombe au
                transporteur).
              </li>
              <li>
                Retard de livraison indépendant de notre volonté (grève, météo,
                etc.)
              </li>
            </ul>
            Nous faisons néanmoins tout notre possible pour faciliter les
            solutions amiables ou les remboursements selon les CGV du
            transporteur.
          </p>
        </div>
        <div className=" w-75 d-flex justify-content-center align-items-center flex-column">
          <h4 className=" align-self-start">5. Contact</h4>
          <p>
            Notre service client est disponible pour vous accompagner :
            <ul>
              <li>Par e-mail : contact@nexway.com</li>
              <li>
                Retard de livraison indépendant de notre volonté (grève, météo,
                etc.)
              </li>
              <li>
                Ou via le formulaire sur notre site{" "}
                <Link to="/contact">ici</Link>
              </li>
            </ul>
            Nous faisons néanmoins tout notre possible pour faciliter les
            solutions amiables ou les remboursements selon les CGV du
            transporteur.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Politique;
