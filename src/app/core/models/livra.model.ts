/**
 * Livra Transaction Types
 */
export type LivraTransactionType =
  | 'EARNED_LIKE'
  | 'EARNED_COMMENT'
  | 'EARNED_FOLLOW'
  | 'EARNED_POST'
  | 'EARNED_CAMPAIGN'
  | 'EARNED_PLAN'
  | 'EARNED_ACHIEVEMENT'
  | 'EARNED_PURCHASE'
  | 'SPENT_TTS'
  | 'SPENT_IMAGE'
  | 'SPENT_CHARACTER'
  | 'SPENT_BOOST'
  | 'EXPIRED'
  | 'ADMIN_ADJUSTMENT';

/**
 * Livra Balance DTO
 */
export interface LivraBalance {
  balance: number;
  lifetime: number;
  spent: number;
}

/**
 * Livra Transaction DTO
 */
export interface LivraTransaction {
  id: string;
  type: LivraTransactionType;
  amount: number;
  balance: number;
  metadata: any;
  expiresAt: Date | null;
  createdAt: Date;
}

/**
 * Paginated Transactions Response
 */
export interface PaginatedTransactions {
  transactions: LivraTransaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Transaction Filters
 */
export interface TransactionFilters {
  type?: LivraTransactionType;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Cost Check Response
 */
export interface CostCheckResponse {
  action: string;
  cost: number;
}

/**
 * Afford Check Response
 */
export interface AffordCheckResponse {
  canAfford: boolean;
  currentBalance: number;
  requiredAmount: number;
  shortfall: number;
}

/**
 * Livra Update WebSocket Event
 */
export interface LivraUpdateEvent {
  type: LivraTransactionType;
  amount: number;
  balance: number;
  timestamp: Date;
}

/**
 * Get transaction type display info
 */
export function getTransactionTypeInfo(type: LivraTransactionType): { 
  label: string; 
  icon: string; 
  color: string;
  isEarned: boolean;
} {
  const typeMap: Record<LivraTransactionType, { label: string; icon: string; color: string; isEarned: boolean }> = {
    EARNED_LIKE: { label: 'Curtida recebida', icon: 'pi-heart-fill', color: 'text-pink-500', isEarned: true },
    EARNED_COMMENT: { label: 'Comentário recebido', icon: 'pi-comment', color: 'text-blue-500', isEarned: true },
    EARNED_FOLLOW: { label: 'Novo seguidor', icon: 'pi-user-plus', color: 'text-green-500', isEarned: true },
    EARNED_POST: { label: 'Post criado', icon: 'pi-pencil', color: 'text-purple-500', isEarned: true },
    EARNED_CAMPAIGN: { label: 'Campanha completada', icon: 'pi-trophy', color: 'text-yellow-500', isEarned: true },
    EARNED_PLAN: { label: 'Bônus mensal', icon: 'pi-star-fill', color: 'text-amber-500', isEarned: true },
    EARNED_ACHIEVEMENT: { label: 'Conquista desbloqueada', icon: 'pi-shield', color: 'text-indigo-500', isEarned: true },
    EARNED_PURCHASE: { label: 'Compra de Livras', icon: 'pi-shopping-cart', color: 'text-teal-500', isEarned: true },
    SPENT_TTS: { label: 'Geração de áudio', icon: 'pi-volume-up', color: 'text-orange-500', isEarned: false },
    SPENT_IMAGE: { label: 'Geração de imagem', icon: 'pi-image', color: 'text-cyan-500', isEarned: false },
    SPENT_CHARACTER: { label: 'Criação de personagem', icon: 'pi-user', color: 'text-violet-500', isEarned: false },
    SPENT_BOOST: { label: 'Impulsionar post', icon: 'pi-bolt', color: 'text-red-500', isEarned: false },
    EXPIRED: { label: 'Expirado', icon: 'pi-clock', color: 'text-gray-500', isEarned: false },
    ADMIN_ADJUSTMENT: { label: 'Ajuste administrativo', icon: 'pi-cog', color: 'text-slate-500', isEarned: true },
  };

  return typeMap[type] || { label: type, icon: 'pi-circle', color: 'text-gray-500', isEarned: false };
}
