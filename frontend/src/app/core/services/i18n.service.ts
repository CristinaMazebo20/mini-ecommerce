import { Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en' | 'fr';

export const TRADUCOES: Record<string, Record<Language, string>> = {
  // ==================== NAVBAR ====================
  'nav.produtos': { pt: 'Produtos', en: 'Products', fr: 'Produits' },
  'nav.carrinho': { pt: 'Carrinho', en: 'Cart', fr: 'Panier' },
  'nav.pedidos': { pt: 'Meus Pedidos', en: 'My Orders', fr: 'Mes Commandes' },
  'nav.admin': { pt: 'Painel de Controle', en: 'Dashboard', fr: 'Tableau de Bord' },
  'nav.login': { pt: 'Entrar', en: 'Login', fr: 'Connexion' },
  'nav.registar': { pt: 'Registar', en: 'Sign Up', fr: "S'inscrire" },
  'nav.sair': { pt: 'Sair', en: 'Logout', fr: 'Déconnexion' },

  // ==================== FOOTER ====================
  'footer.sobre': { pt: 'Sobre', en: 'About', fr: 'À propos' },
  'footer.sobre.texto': { pt: 'Sua loja de confiança com os melhores produtos tecnológicos.', en: 'Your trusted store with the best tech products.', fr: 'Votre boutique de confiance avec les meilleurs produits tech.' },
  'footer.links': { pt: 'Links Rápidos', en: 'Quick Links', fr: 'Liens Rapides' },
  'footer.produtos': { pt: 'Produtos', en: 'Products', fr: 'Produits' },
  'footer.carrinho': { pt: 'Carrinho', en: 'Cart', fr: 'Panier' },
  'footer.pedidos': { pt: 'Meus Pedidos', en: 'My Orders', fr: 'Mes Commandes' },
  'footer.contato': { pt: 'Contato', en: 'Contact', fr: 'Contact' },
  'footer.direitos': { pt: 'Todos os direitos reservados', en: 'All rights reserved', fr: 'Tous droits réservés' },

  // ==================== HERO ====================
  'hero.title': { pt: 'MazeboShop', en: 'MazeboShop', fr: 'MazeboShop' },
  'hero.subtitle': { pt: 'Moda, estilo e tecnologia para realçar sua essência', en: 'Fashion, style and technology to enhance your essence', fr: 'Mode, style et technologie pour rehausser votre essence' },
  'hero.button': { pt: 'Ver Ofertas', en: 'See Offers', fr: 'Voir les Offres' },

  // ==================== PRODUTOS ====================
  'produto.add': { pt: 'Adicionar ao Carrinho', en: 'Add to Cart', fr: 'Ajouter au Panier' },
  'produto.ofertas': { pt: 'Ofertas Especiais', en: 'Special Offers', fr: 'Offres Spéciales' },
  'produto.filtros': { pt: 'Categorias:', en: 'Categories:', fr: 'Catégories:' },
  'produto.ver': { pt: 'Ver Produtos', en: 'View Products', fr: 'Voir les Produits' },
  'produto.detalhes': { pt: 'Ver Detalhes', en: 'View Details', fr: 'Voir Détails' },
  'produto.estoque': { pt: 'Em estoque', en: 'In Stock', fr: 'En Stock' },
  'produto.esgotado': { pt: 'Esgotado', en: 'Out of Stock', fr: 'Rupture' },

  // ==================== CARRINHO ====================
  'cart.titulo': { pt: 'Meu Carrinho', en: 'My Cart', fr: 'Mon Panier' },
  'cart.vazio': { pt: 'Seu carrinho está vazio', en: 'Your cart is empty', fr: 'Votre panier est vide' },
  'cart.vazio.mensagem': { pt: 'Adicione produtos clicando em "Adicionar ao Carrinho" na página de produtos.', en: 'Add products by clicking "Add to Cart" on the products page.', fr: 'Ajoutez des produits en cliquant sur "Ajouter au Panier" sur la page des produits.' },
  'cart.total': { pt: 'Total', en: 'Total', fr: 'Total' },
  'cart.finalizar': { pt: 'Finalizar Compra', en: 'Checkout', fr: 'Valider' },
  'cart.subtotal': { pt: 'Subtotal', en: 'Subtotal', fr: 'Sous-total' },
  'cart.frete': { pt: 'Frete', en: 'Shipping', fr: 'Livraison' },
  'cart.frete.gratis': { pt: 'Grátis', en: 'Free', fr: 'Gratuit' },
  'cart.remover': { pt: 'Remover', en: 'Remove', fr: 'Supprimer' },

  // ==================== CHECKOUT ====================
  'checkout.titulo': { pt: 'Finalizar Compra', en: 'Checkout', fr: 'Validation' },
  'checkout.endereco': { pt: 'Endereço de Entrega', en: 'Shipping Address', fr: 'Adresse de Livraison' },
  'checkout.nome': { pt: 'Nome completo', en: 'Full name', fr: 'Nom complet' },
  'checkout.rua': { pt: 'Endereço', en: 'Address', fr: 'Adresse' },
  'checkout.cidade': { pt: 'Cidade', en: 'City', fr: 'Ville' },
  'checkout.cep': { pt: 'CEP', en: 'ZIP Code', fr: 'Code Postal' },
  'checkout.pagamento': { pt: 'Forma de Pagamento', en: 'Payment Method', fr: 'Moyen de Paiement' },
  'checkout.pix': { pt: 'PIX (10% desconto)', en: 'PIX (10% off)', fr: 'PIX (10% réduction)' },
  'checkout.cartao': { pt: 'Cartão de Crédito', en: 'Credit Card', fr: 'Carte de Crédit' },
  'checkout.dinheiro': { pt: 'Dinheiro', en: 'Cash', fr: 'Espèces' },
  'checkout.confirmar': { pt: 'Finalizar Compra', en: 'Checkout', fr: 'Valider la Commande' },
  'checkout.resumo': { pt: 'Resumo do Pedido', en: 'Order Summary', fr: 'Résumé de la Commande' },
  'checkout.desconto': { pt: 'Desconto (PIX)', en: 'Discount (PIX)', fr: 'Réduction (PIX)' },

  // ==================== PEDIDOS ====================
  'pedidos.titulo': { pt: 'Meus Pedidos', en: 'My Orders', fr: 'Mes Commandes' },
  'pedidos.sem': { pt: 'Nenhum pedido encontrado', en: 'No orders found', fr: 'Aucune commande trouvée' },
  'pedidos.id': { pt: 'Pedido #', en: 'Order #', fr: 'Commande #' },
  'pedidos.status': { pt: 'Status', en: 'Status', fr: 'Statut' },
  'pedidos.total': { pt: 'Total', en: 'Total', fr: 'Total' },
  'pedidos.data': { pt: 'Data', en: 'Date', fr: 'Date' },
  'pedidos.detalhes': { pt: 'Ver Detalhes', en: 'View Details', fr: 'Voir Détails' },
  'pedidos.pendente': { pt: 'Pendente', en: 'Pending', fr: 'En attente' },
  'pedidos.pago': { pt: 'Pago', en: 'Paid', fr: 'Payé' },
  'pedidos.enviado': { pt: 'Enviado', en: 'Shipped', fr: 'Expédié' },
  'pedidos.entregue': { pt: 'Entregue', en: 'Delivered', fr: 'Livré' },

  // ==================== ADMIN ====================
  'admin.dashboard': { pt: 'Dashboard', en: 'Dashboard', fr: 'Tableau de Bord' },
  'admin.produtos': { pt: 'Produtos', en: 'Products', fr: 'Produits' },
  'admin.pedidos': { pt: 'Pedidos', en: 'Orders', fr: 'Commandes' },
  'admin.usuarios': { pt: 'Utilizadores', en: 'Users', fr: 'Utilisateurs' },
  'admin.relatorios': { pt: 'Relatórios', en: 'Reports', fr: 'Rapports' },
  'admin.ver_loja': { pt: 'Ver Loja', en: 'View Store', fr: 'Voir la Boutique' },
  'admin.total_produtos': { pt: 'Total de Produtos', en: 'Total Products', fr: 'Total Produits' },
  'admin.total_pedidos': { pt: 'Total de Pedidos', en: 'Total Orders', fr: 'Total Commandes' },
  'admin.total_clientes': { pt: 'Total de Clientes', en: 'Total Customers', fr: 'Total Clients' },
  'admin.faturamento': { pt: 'Faturamento', en: 'Revenue', fr: 'Chiffre d\'affaires' },
  'admin.ultimos_pedidos': { pt: 'Últimos Pedidos', en: 'Recent Orders', fr: 'Commandes Récentes' },

  // ==================== OFERTAS ====================
  'ofertas.titulo': { pt: 'Ofertas Especiais', en: 'Special Offers', fr: 'Offres Spéciales' },
  'ofertas.subtitulo': { pt: 'Produtos com descontos imperdíveis por tempo limitado!', en: 'Products with unmissable discounts for a limited time!', fr: 'Produits avec des réductions à ne pas manquer pour une durée limitée!' },
  'ofertas.comprar': { pt: 'Comprar Agora', en: 'Buy Now', fr: 'Acheter Maintenant' },

  // ==================== AUTENTICAÇÃO ====================
  'auth.login.titulo': { pt: 'Entrar na sua conta', en: 'Login to your account', fr: 'Connectez-vous à votre compte' },
  'auth.login.email': { pt: 'Email', en: 'Email', fr: 'Email' },
  'auth.login.senha': { pt: 'Senha', en: 'Password', fr: 'Mot de passe' },
  'auth.login.entrar': { pt: 'Entrar', en: 'Login', fr: 'Se connecter' },
  'auth.login.criar_conta': { pt: 'Criar nova conta', en: 'Create new account', fr: 'Créer un compte' },
  'auth.login.esqueceu': { pt: 'Esqueceu a senha?', en: 'Forgot password?', fr: 'Mot de passe oublié?' },
  'auth.registo.titulo': { pt: 'Criar nova conta', en: 'Create new account', fr: 'Créer un compte' },
  'auth.registo.nome': { pt: 'Nome completo', en: 'Full name', fr: 'Nom complet' },
  'auth.registo.email': { pt: 'Email', en: 'Email', fr: 'Email' },
  'auth.registo.senha': { pt: 'Senha', en: 'Password', fr: 'Mot de passe' },
  'auth.registo.confirmar': { pt: 'Confirmar senha', en: 'Confirm password', fr: 'Confirmer le mot de passe' },
  'auth.registo.registar': { pt: 'Registar', en: 'Sign Up', fr: "S'inscrire" },
  'auth.registo.ja_conta': { pt: 'Já tenho uma conta', en: 'Already have an account', fr: 'J\'ai déjà un compte' },
  'auth.recuperar.titulo': { pt: 'Recuperar senha', en: 'Reset password', fr: 'Réinitialiser le mot de passe' },
  'auth.recuperar.instrucao': { pt: 'Digite seu email e enviaremos instruções para redefinir sua senha.', en: 'Enter your email and we will send instructions to reset your password.', fr: 'Entrez votre email et nous enverrons les instructions pour réinitialiser votre mot de passe.' },
  'auth.recuperar.enviar': { pt: 'Enviar instruções', en: 'Send instructions', fr: 'Envoyer les instructions' },
  'auth.recuperar.sucesso': { pt: 'Instruções de recuperação enviadas para o seu email.', en: 'Recovery instructions sent to your email.', fr: 'Instructions de récupération envoyées à votre email.' },
'auth.login.email_invalido': { pt: 'Email inválido', en: 'Invalid email', fr: 'Email invalide' }, 
   'auth.recuperar.token_info': { pt: 'Um link de recuperação foi enviado para seu email. (Simulação - token abaixo)', en: 'A recovery link has been sent to your email. (Simulation - token below)', fr: 'Un lien de récupération a été envoyé à votre email. (Simulation - token ci-dessous)' },
'auth.recuperar.solicitar_novo': { pt: 'Solicitar novo link', en: 'Request new link', fr: 'Demander un nouveau lien' },
'auth.redefinir.titulo': { pt: 'Redefinir senha', en: 'Reset password', fr: 'Réinitialiser le mot de passe' },
'auth.redefinir.salvar': { pt: 'Salvar nova senha', en: 'Save new password', fr: 'Enregistrer le nouveau mot de passe' },
'auth.redefinir.ir_login': { pt: 'Ir para o login', en: 'Go to login', fr: 'Aller à la connexion' },
'auth.redefinir.token_invalido': { pt: 'Token inválido ou expirado. Solicite uma nova recuperação.', en: 'Invalid or expired token. Request a new recovery.', fr: 'Token invalide ou expiré. Demandez une nouvelle récupération.' },

  // ==================== COMUNS ====================
  'common.salvar': { pt: 'Salvar', en: 'Save', fr: 'Enregistrer' },
  'common.cancelar': { pt: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  'common.excluir': { pt: 'Excluir', en: 'Delete', fr: 'Supprimer' },
  'common.editar': { pt: 'Editar', en: 'Edit', fr: 'Modifier' },
  'common.carregando': { pt: 'Carregando...', en: 'Loading...', fr: 'Chargement...' },
  'common.erro': { pt: 'Erro', en: 'Error', fr: 'Erreur' },
  'common.sucesso': { pt: 'Sucesso!', en: 'Success!', fr: 'Succès!' },
  'common.incompleto': { pt: 'incompleto', en: 'incomplete', fr: 'incomplet' },
  'common.confirmar': { pt: 'Confirmar', en: 'Confirm', fr: 'Confirmer' },
  'common.voltar': { pt: 'Voltar', en: 'Back', fr: 'Retour' },
  'common.fechar': { pt: 'Fechar', en: 'Close', fr: 'Fermer' },
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private langSignal = signal<Language>('pt');
  public currentLang = this.langSignal.asReadonly();

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'pt' || savedLang === 'en' || savedLang === 'fr') {
      this.langSignal.set(savedLang);
    }
  }

  t(key: string): string {
    const traducao = TRADUCOES[key];
    if (!traducao) {
      console.warn(`Tradução não encontrada para: ${key}`);
      return key;
    }
    return traducao[this.langSignal()];
  }

  setLanguage(lang: Language): void {
    this.langSignal.set(lang);
    localStorage.setItem('language', lang);
  }

  toggleLanguage(): void {
    const languages: Language[] = ['pt', 'en', 'fr'];
    const currentIndex = languages.indexOf(this.langSignal());
    const nextIndex = (currentIndex + 1) % languages.length;
    this.setLanguage(languages[nextIndex]);
  }

  getLanguageLabel(): string {
    const labels = { pt: '🇵🇹 PT', en: '🇬🇧 EN', fr: '🇫🇷 FR' };
    return labels[this.langSignal()];
  }
}