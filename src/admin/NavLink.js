import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuItemImageActive from './images/btn_active.png';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

class NavLink extends React.Component {
    render() {
        //const { classes, theme } = this.props;

        var isActive = this.context.router.route.location.pathname === this.props.to;
        console.log(this.context.router.route.location.pathname);
        var className = isActive ? 'menuactive' : 'menuinactive';

        return(
            <Link {...this.props}>
               <ListItem className={className} {...this.props}>
                    {this.props.children}
                </ListItem>
            </Link>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

export default NavLink;
