'use client';

import {
  Wallet,
  CreditCard,
  Coins,
  PiggyBank,
  Landmark,
  TrendingUp,
  BarChart3,
  Receipt,
  HandCoins,
  CircleDollarSign,
  ArrowUpFromLine,
  Banknote,
  CircleDollarSign as DollarSign,
  Gem,
  Sparkles,
  Star,
  Shield,
  Lock,
  Award,
  GraduationCap,
  Users,
  Building2,
  School,
  BookOpen,
  Trophy,
  Crown,
  Diamond,
  HeartHandshake,
  Leaf,
  Flower,
  Cloud,
  Sun,
  Moon,
  Star as StarIcon,
  Compass,
  MapPin,
  Globe,
  Send,
  Gift,
  Rocket,
  Plane,
  Ship,
  Anchor,
  Briefcase,
  FileText,
  ScrollText,
  Layers,
  Grid,
  Layout,
  PanelTop,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
} from 'lucide-react';

// More diverse icon set
const icons = [
  // Financial icons
  { Icon: Wallet, size: 48 },
  { Icon: CreditCard, size: 36 },
  { Icon: Coins, size: 52 },
  { Icon: ArrowUpFromLine, size: 44 },
  { Icon: PiggyBank, size: 38 },
  { Icon: HandCoins, size: 30 },
  { Icon: CircleDollarSign, size: 42 },
  { Icon: TrendingUp, size: 34 },
  { Icon: Landmark, size: 46 },
  { Icon: BarChart3, size: 28 },
  { Icon: Receipt, size: 32 },
  { Icon: Banknote, size: 40 },
  { Icon: DollarSign, size: 36 },
  
  // Academic icons
  { Icon: GraduationCap, size: 40 },
  { Icon: School, size: 38 },
  { Icon: BookOpen, size: 34 },
  { Icon: Users, size: 44 },
  { Icon: Building2, size: 36 },
  { Icon: Award, size: 32 },
  { Icon: Trophy, size: 30 },
  { Icon: Crown, size: 28 },
  { Icon: Diamond, size: 34 },
  { Icon: Shield, size: 36 },
  { Icon: Lock, size: 28 },
  { Icon: HeartHandshake, size: 32 },
  
  // Nature/Atmosphere
  { Icon: Leaf, size: 30 },
  { Icon: Flower, size: 28 },
  { Icon: Cloud, size: 36 },
  { Icon: Sun, size: 34 },
  { Icon: Moon, size: 30 },
  { Icon: StarIcon, size: 26 },
  { Icon: Compass, size: 32 },
  { Icon: MapPin, size: 28 },
  { Icon: Globe, size: 38 },
  
  // Action icons
  { Icon: Send, size: 32 },
  { Icon: Gift, size: 30 },
  { Icon: Rocket, size: 36 },
  { Icon: Plane, size: 34 },
  { Icon: Ship, size: 32 },
  { Icon: Anchor, size: 28 },
  { Icon: Briefcase, size: 34 },
  { Icon: FileText, size: 30 },
  { Icon: ScrollText, size: 32 },
  
  // Geometric
  { Icon: Layers, size: 36 },
  { Icon: Grid, size: 30 },
  { Icon: Layout, size: 32 },
  { Icon: PanelTop, size: 28 },
  { Icon: Square, size: 24 },
  { Icon: Circle, size: 24 },
  { Icon: Triangle, size: 26 },
  { Icon: Hexagon, size: 28 },
  { Icon: Octagon, size: 26 },
  
  // Decorative
  { Icon: Gem, size: 34 },
  { Icon: Sparkles, size: 26 },
  { Icon: Star, size: 28 },
];

// More spread out positions
const positions = [
  // Row 1
  'top-[5%] left-[2%]',
  'top-[3%] right-[3%]',
  'top-[12%] left-[18%]',
  'top-[8%] right-[22%]',
  'top-[20%] left-[8%]',
  'top-[18%] right-[12%]',
  
  // Row 2
  'top-[35%] left-[1%]',
  'top-[30%] right-[2%]',
  'top-[40%] left-[15%]',
  'top-[38%] right-[18%]',
  'top-[45%] left-[25%]',
  'top-[42%] right-[28%]',
  
  // Row 3
  'top-[55%] left-[3%]',
  'top-[52%] right-[4%]',
  'top-[60%] left-[20%]',
  'top-[58%] right-[15%]',
  'top-[65%] left-[10%]',
  'top-[62%] right-[25%]',
  
  // Row 4
  'top-[78%] left-[1%]',
  'top-[75%] right-[2%]',
  'top-[82%] left-[16%]',
  'top-[80%] right-[20%]',
  'top-[88%] left-[8%]',
  'top-[85%] right-[12%]',
  
  // Row 5 - Bottom
  'bottom-[2%] left-[5%]',
  'bottom-[4%] right-[6%]',
  'bottom-[1%] left-[22%]',
  'bottom-[3%] right-[18%]',
  'bottom-[6%] left-[35%]',
  'bottom-[5%] right-[32%]',
  
  // Middle extra
  'top-[25%] left-[42%]',
  'top-[48%] left-[38%]',
  'top-[70%] left-[42%]',
  'top-[15%] right-[42%]',
  'top-[40%] right-[38%]',
  'top-[65%] right-[42%]',
];

const delays = [
  '0s', '2.5s', '1.2s', '3.8s', '0.8s', '4.2s',
  '1.5s', '3.2s', '0.3s', '4.8s', '2.1s', '1.8s',
  '3.5s', '0.5s', '2.8s', '4.5s', '1.1s', '3.9s',
  '2.3s', '0.7s', '4.1s', '1.6s', '3.3s', '0.9s',
  '4.7s', '1.9s', '3.1s', '0.4s', '2.6s', '4.3s',
  '1.3s', '3.7s', '2.2s', '0.6s', '4.0s', '1.7s',
];

const rotations = [
  'rotate-0', 'rotate-6', '-rotate-3', 'rotate-12', '-rotate-8', 'rotate-4',
  '-rotate-6', 'rotate-8', '-rotate-12', 'rotate-3', '-rotate-5', 'rotate-10',
  'rotate-2', '-rotate-4', 'rotate-7', '-rotate-9', 'rotate-5', '-rotate-7',
  'rotate-11', '-rotate-2', 'rotate-9', '-rotate-6', 'rotate-3', '-rotate-11',
  'rotate-6', '-rotate-8', 'rotate-4', '-rotate-10', 'rotate-8', '-rotate-3',
  'rotate-5', '-rotate-7', 'rotate-10', '-rotate-4', 'rotate-6', '-rotate-5',
];

export function BackgroundIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map(({ Icon, size }, index) => (
        <div
          key={index}
          className={`absolute ${positions[index % positions.length]} ${rotations[index % rotations.length]} text-primary/5 transition-all duration-500 hover:scale-110 hover:text-primary/15 hover:rotate-12 group cursor-default`}
          style={{
            fontSize: size,
            animationDelay: delays[index % delays.length],
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="relative">
            <Icon 
              size={size} 
              strokeWidth={1.5} 
              className="animate-float-icon transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" 
            />
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-full bg-primary/0 transition-all duration-500 group-hover:bg-primary/5 group-hover:scale-150 -z-10 blur-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}