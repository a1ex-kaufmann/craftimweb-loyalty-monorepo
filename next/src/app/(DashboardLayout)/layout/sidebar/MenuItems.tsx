import {
  IconAperture,
  IconCash,
  IconLayoutDashboard,
  IconLogin,
  IconCreditCard,
  IconGift,
  IconUserPlus,
  IconDiamond,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Главная",
  },

  {
    id: uniqueId(),
    title: "Дашборд",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Менеджер",
  },
  {
    id: uniqueId(),
    title: "Токены",
    icon: IconDiamond,
    href: "/manager/tokens",
  },
  {
    id: uniqueId(),
    title: "Системы лояльности",
    icon: IconGift,
    href: "/manager/loyalties",
  },
  {
    navlabel: true,
    subheader: "Касса",
  },
  {
    id: uniqueId(),
    title: "Покупки",
    icon: IconCash,
    href: "/cashbox/purchases",
  },
  // {
  //   id: uniqueId(),
  //   title: "Покупатели",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
  {
    navlabel: true,
    subheader: "Пользователь",
  },
  {
    id: uniqueId(),
    title: "Бонусная карта",
    icon: IconCreditCard,
    href: "/user/balances",
  },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;
