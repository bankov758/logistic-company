package com.nbu.logisticcompany.services;

import com.nbu.logisticcompany.entities.Company;
import com.nbu.logisticcompany.entities.Role;
import com.nbu.logisticcompany.entities.User;
import com.nbu.logisticcompany.exceptions.DuplicateEntityException;
import com.nbu.logisticcompany.exceptions.EntityNotFoundException;
import com.nbu.logisticcompany.exceptions.InvalidDataException;
import com.nbu.logisticcompany.exceptions.UnauthorizedOperationException;
import com.nbu.logisticcompany.repositories.interfaces.UserRepository;
import com.nbu.logisticcompany.services.interfaces.UserService;
import com.nbu.logisticcompany.utils.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final String UNAUTHORIZED_ROLE_UPDATE = "Only an admin account can change roles";

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getById(int id) {
        return userRepository.getById(id);
    }

    @Override
    public User getByUsername(String username) {
        return userRepository.getByField("username", username);
    }

    @Override
    public List<User> getAll(Optional<String> search) {
        return userRepository.getAll();
    }

    @Override
    public Company getEmployeeCompany(int employeeId) {
        return userRepository.getEmployeeCompany(employeeId);
    }

    /**
     * Registers a new user with hashed password and default 'USER' role.
     * Checks for duplicate usernames before proceeding. If the username is unique,
     * hashes the password and saves the user. Then assigns the 'USER' role.
     *
     * @param user User to register; requires unique username and plain text password.
     * @return Saved User with hashed password.
     * @throws DuplicateEntityException if username already exists.
     */
    @Override
    public User create(User user) {
        boolean duplicateUser = true;
        try {
            userRepository.getByField("username", user.getUsername());
        } catch (EntityNotFoundException e) {
            duplicateUser = false;
        }
        if (duplicateUser) {
            throw new DuplicateEntityException("User", "username", user.getUsername());
        }

//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        String hashedPassword = passwordEncoder.encode(user.getPassword());
//        user.setPassword(hashedPassword);

        userRepository.create(user);
        User alreadySaved = getById(user.getId());
        addRole(alreadySaved, Role.USER.name(), getById(user.getId()));
        return alreadySaved;
    }
    /**
     * Updates an existing user's information. If a new password is provided, it will be hashed before update.
     * Only the owner of the account or an authorized updater can perform the update.
     *
     * Validates the updater's authority over the account. If the user provides a new password, and it doesn't match
     * the current password, the new password is hashed and set for update.
     *
     * @param userToUpdate The user object containing updated information.
     * @param updater The user attempting to perform the update, needs to be the owner or authorized.
     * @throws UNAUTHORIZED_USER_UPDATE if the updater is not authorized to update the user.
     */
    @Override
    public void update(User userToUpdate, User updater) {
        ValidationUtil.validateOwnerUpdate(userToUpdate.getId(), updater.getId());
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        if (ValidationUtil.isNotEmpty(userToUpdate.getPassword())
//                && !passwordEncoder.matches(userToUpdate.getPassword(), updater.getPassword())){
//            String hashedPassword = passwordEncoder.encode(userToUpdate.getPassword());
//            userToUpdate.setPassword(hashedPassword);
//        }
        userRepository.update(userToUpdate);
    }
    /**
     * Adds a specified role to a user if the updater has the right to modify roles.
     * Validates the updater's rights to add the role before updating the user's role list.
     * The role is then added to the user's roles and the user information is updated in the repository.
     *
     * @param user The user to whom the role will be added.
     * @param role The role to be added to the user. Must be a valid role name that corresponds to the {@link Role} enum.
     * @param updater The user attempting to add the role. Must have sufficient permissions to modify roles.
     */
    @Override
    public void addRole(User user, String role, User updater) {
        validateRoleUpdate(role, updater);
        user.getRoles().add(Role.valueOf(role));
        userRepository.update(user);
    }
    /** Same as addRole, but for removal of roles
     *
     * @param user The user to whom the role will be added.
     * @param role The role to be added to the user. Must be a valid role name that corresponds to the {@link Role} enum.
     * @param updater The user attempting to add the role. Must have sufficient permissions to modify roles.
     */
    @Override
    public void removeRole(User user, String role, User updater) {
        validateRoleUpdate(role, updater);
        user.getRoles().remove(Role.valueOf(role));
        userRepository.update(user);
    }
    /**
     * Deletes a user from the repository based on user ID, if the requesting user has appropriate permissions.
     * Validates that the requesting user is the same as the deleting user (user self deletion)
     *
     * @param id The ID of the user to be deleted.
     * @param user The user requesting the delete operation. Must have permissions to delete the target user.
     */
    @Override
    public void delete(int id, User user) {
        ValidationUtil.validateOwnerDelete(id, user.getId());
        userRepository.delete(id);
    }
    /**
     * Validates updater's authority for role assignment and role validity.
     * Ensures the updater has 'ADMIN' role to proceed. Validates the specified role against existing {@link Role} enums.
     *
     * @param role The role to be validated.
     * @param updater The user attempting role update; must be an 'ADMIN'.
     * @throws UnauthorizedOperationException if updater lacks 'ADMIN' role.
     * @throws InvalidDataException if the specified role is invalid.
     */
    private void validateRoleUpdate(String role, User updater) {
        if (ValidationUtil.isNotEmpty(updater.getRoles()) && !updater.getRoles().contains(Role.ADMIN)) {
            throw new UnauthorizedOperationException(UNAUTHORIZED_ROLE_UPDATE);
        }
        if (Arrays.stream(Role.values()).noneMatch(value -> value.toString().equals(role))) {
            throw new InvalidDataException(User.class.getSimpleName(), "role", role);
        }
    }

}
