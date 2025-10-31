import { Link } from 'react-router-dom';
import { useState } from 'react';
import BaseButton from '../../../components/Base/BaseButton';
import CommunitySection from '../CommunitySection/CommunitySection';
import './LandingPage.css';
import AppMockup from "/app-mockup.png";
import MobileActions from "/mobile-actions.png";
import MobileProfile from "/mobile-profile.png";
import Logo from "../../../assets/lg-logo-horizontal.webp";
import { useAuth } from '../../../hooks/useAuth';
import ButtonLink from '../../../components/Base/ButtonLink';
import { Heading } from '../../../components/Base/Heading';

const cardsItems = [
  { 
    id: 1, 
    title: "Seguí tu progreso", 
    description: "Medí tu huella de carbono y seguí tu progreso.",
    icon: "/progress-icon.svg"
  },
  { 
    id: 2, 
    title: "Lográ acciones ecológicas", 
    description: "Descubrí acciones del el día a día para reducir tu impacto.",
    icon: "/actions-icon.svg"
  },
  { 
    id: 3, 
    title: "Unite a la comunidad", 
    description: "Conectate con otras personas para mejorar el mundo.",
    icon: "/community-icon.svg"
  }
];

function LandingPage () {
  const { userId: authUserId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    <section>
      <div className="bg-hero flex items-center justify-center md:justify-start rounded-b-[30px] lg:rounded-b-[60px] relative">
        {/* Logo */}
        <Link to="/" className='absolute top-10 left-6 md:left-20 h-10 flex items-center'>
          <img src={Logo} alt="Reducir Logo" className='h-12' />
        </Link>
        {/* Nav Container */}
        <div className='absolute top-10 right-4 md:right-8 flex items-center gap-4'>
          {/* Desktop Nav */}
          <div className='hidden md:block'>
            {authUserId ?
              <ButtonLink 
                to={`/app/home/${authUserId}`}
              >Ir a la App</ButtonLink>   
              :
              <ButtonLink 
                to={`/login`}
              >Ir a la App</ButtonLink>              
            }  
          </div>
          <div className='hidden md:flex w-auto h-10 bg-white/70 rounded-[60px] shadow items-center justify-around px-6'>
            <nav className='flex items-center h-10 justify-around gap-2'>
              <a href='#como-funciona' className='text-lg md:text-base font-semibold px-2 hover:text-dark-green transition-colors'>Cómo funciona</a>
              <a href='#nosotros' className='text-lg md:text-base font-semibold px-2 hover:text-dark-green transition-colors'>Nosotros</a>
              <div className='flex gap-4 md:gap-6 items-center pl-4'>
                <a href="#" className='cursor-pointer hover:text-dark-green transition-colors'>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#" className='cursor-pointer hover:text-dark-green transition-colors'>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2918_147)"><path d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_2918_147"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                </a>
              </div>
            </nav>
          </div>

          {/* Hamburger Button */}
          <div className='md:hidden flex items-center justify-center h-16 w-16 bg-white/70 rounded-full shadow'>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50">
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
          <nav className='mt-24 flex flex-col items-center gap-8'>
            <a href='#como-funciona' onClick={() => setIsMenuOpen(false)} className='text-xl font-medium'>Cómo funciona</a>
            <a href='#nosotros' onClick={() => setIsMenuOpen(false)} className='text-xl font-medium'>Nosotros</a>
            {authUserId ?
              <ButtonLink 
                to={`/app/home/${authUserId}`}
              >Ir a la App</ButtonLink>   
              :
              <ButtonLink 
                to={`/login`}
              >Ir a la App</ButtonLink>              
            }  
          </nav>
        </div> 

        <div className="w-full h-full self-end md:self-center pb-12 md:pb-0 md:w-[45%] px-6 md:px-20 md:pt-12 flex flex-col gap-6">
          <Heading tag="h1" variant="display">
            Estás a un <span className="text-dark-green font-semibold">click</span> 
            <span className='block'>de <strong className='font-medium'><span className="text-dark-green font-semibold">cambiar</span> tus <span className="text-dark-green font-semibold">hábitos</span></strong></span>
            <span className='block'>y el <strong className="text-dark-green font-semibold">mundo</strong></span>
          </Heading>
          <ButtonLink to="/register" variant="filled">
              Conocer la App
          </ButtonLink>
        </div>
      </div>
    </section>

    <section id='como-funciona' className='my-20 md:my-40 mx-6 md:mx-20'>
      <div className='text-center mb-20 flex flex-col gap-6'>
        <Heading tag='h2' variant='headline' size='large' weight='semibold'>¿Cómo funciona Reducir App?</Heading>
        <p className='text-xl md:text-2xl w-full lg:w-4/5 mx-auto'>reducir es una aplicación web y móvil que te acompaña en tu día a día ayudándote a incorporar hábitos amigables con el medio ambiente.</p>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start gap-10'>
        {cardsItems?.map((item) => (
          <div key={item?.id} className='text-center flex flex-col gap-2 items-center justify-center w-full md:w-1/3'>
            <img src={item?.icon} alt=""  className='mb-4'/>
            <Heading tag='h3' variant='title' size='large' weight='semibold'>{item.title}</Heading>
            <p className='text-lg w-4/5 mx-auto'>{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section id='nosotros' className='pb-30 flex flex-col lg:flex-row justify-center items-center gap-10 px-10 max-w-full lg:max-w-[80%] mx-auto'>
      <div className='flex-1 flex justify-center '>
        <div className='relative flex items-center justify-center w-[300px] h-[400px] sm:h-[500px] lg:h-[600px] lg:w-[90%]'>
          {/* Imagen izquierda - Más chica */}
          <img 
            src={MobileActions} 
            alt="Mobile Actions" 
            className='absolute left-0 w-[50%] sm:w-[45%] h-auto z-10 drop-shadow-2xl'
          />
          
          {/* Imagen derecha - Más grande y superpuesta */}
          <img 
            src={MobileProfile} 
            alt="Mobile Profile" 
            className='absolute right-0 w-[60%] sm:w-[55%] h-auto z-20 drop-shadow-2xl lg:right-5'
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 flex-1 text-center items-center lg:items-start lg:text-left'>
        <Heading tag='h2' variant='headline' size='large' weight='semibold'>Haciendo posible <strong className='text-dark-green block'>un mundo mejor</strong></Heading>
        <p className='text-lg mb-2'>Desde actividades divertidas y sociales hasta acciones para reducir tu huella de carbono, elegí lo que te haga bien y descubrí el impacto que generás.</p>
        <ButtonLink to="/register" variant="filled" size="lg">
            Conocer la App
        </ButtonLink>
      </div>
    </section>

    <CommunitySection />

    <footer className='my-10 mx-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0'>
      <p>© 2025 Reducir App. Todos los derechos reservados.</p>
      <div className='flex gap-6 items-center'>
        <a href="#" className='cursor-pointer hover:text-dark-green transition-colors'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href="#" className='cursor-pointer hover:text-dark-green transition-colors'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2918_147)">
            <path d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_2918_147">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </a>
      </div>
    </footer>
    </>
  )
};

export default LandingPage;
