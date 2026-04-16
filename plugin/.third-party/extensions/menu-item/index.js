const menuID = Symbol("menu item identification");

export const activate = ({ views, notification, _events }) => {
  const nudge = () => notification.publish({ message: "O plugin do menu que me executou!" });

  views.menu.append({
    id: menuID,
    name: "Item no menu",
    action: nudge,
  });
};

export const deactivate = ({ views }) => {
  views.menu.detach(menuID);
};
