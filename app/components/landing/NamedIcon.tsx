'use client';

import {Icon, type IconProps} from '@astryxdesign/core/Icon';
import {
  ShieldCheck,
  Users,
  ListChecks,
  Lock,
  CreditCard,
  CircleCheck,
  FileText,
  Headphones,
  Star,
  BadgeDollarSign,
  BadgeIndianRupee,
  IndianRupee,
  Gift,
  ChevronRight,
  ChevronDown,
  Check,
  MessageSquareText,
  Receipt,
  Landmark,
  Banknote,
  Wallet,
  Bitcoin,
  Coins,
  Link2,
  Activity,
  UserPlus,
  Mail,
} from 'lucide-react';

const ICONS = {
  'shield-check': ShieldCheck,
  users: Users,
  'list-checks': ListChecks,
  lock: Lock,
  'credit-card': CreditCard,
  'check-circle': CircleCheck,
  'file-text': FileText,
  headphones: Headphones,
  star: Star,
  'badge-dollar-sign': BadgeDollarSign,
  'badge-indian-rupee': BadgeIndianRupee,
  'indian-rupee': IndianRupee,
  gift: Gift,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  check: Check,
  link: Link2,
  activity: Activity,
  'user-plus': UserPlus,
  mail: Mail,
  'message-square-text': MessageSquareText,
  receipt: Receipt,
  landmark: Landmark,
  banknote: Banknote,
  wallet: Wallet,
  bitcoin: Bitcoin,
  coins: Coins,
} as const;

export type NamedIconName = keyof typeof ICONS;

export interface NamedIconProps {
  name: NamedIconName;
  size?: IconProps['size'];
  className?: string;
}

/** Client-side icon bridge: lets server sections reference lucide by string key. */
export function NamedIcon({name, size = 'md', className}: NamedIconProps) {
  return <Icon icon={ICONS[name]} size={size} className={className} />;
}
