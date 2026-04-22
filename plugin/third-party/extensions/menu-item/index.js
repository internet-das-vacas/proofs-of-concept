const menuID = Symbol("menu item identification");

export const activate = ({ views, notification, _events }) => {
  const nudge = () => notification.publish({ message: "O plugin do menu que me executou! E eu sou parte do plugin" });

  views.menu.append({
    id: menuID,
    name: "Item no menu",
    action: nudge,
  });
};

export const deactivate = ({ views, notification }) => {
  notification.publish({ message: "Você etá desinstalando o plugin agora..." });
  views.menu.detach(menuID);
};
