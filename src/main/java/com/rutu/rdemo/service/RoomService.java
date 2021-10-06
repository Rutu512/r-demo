package com.rutu.rdemo.service;

import com.rutu.rdemo.domain.Room;
import com.rutu.rdemo.repository.RoomRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Room}.
 */
@Service
@Transactional
public class RoomService {

    private final Logger log = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
     * Save a room.
     *
     * @param room the entity to save.
     * @return the persisted entity.
     */
    public Room save(Room room) {
        log.debug("Request to save Room : {}", room);
        return roomRepository.save(room);
    }

    /**
     * Partially update a room.
     *
     * @param room the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Room> partialUpdate(Room room) {
        log.debug("Request to partially update Room : {}", room);

        return roomRepository
            .findById(room.getId())
            .map(
                existingRoom -> {
                    if (room.getRoomname() != null) {
                        existingRoom.setRoomname(room.getRoomname());
                    }

                    return existingRoom;
                }
            )
            .map(roomRepository::save);
    }

    /**
     * Get all the rooms.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Room> findAll() {
        log.debug("Request to get all Rooms");
        return roomRepository.findAll();
    }

    /**
     * Get one room by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Room> findOne(Long id) {
        log.debug("Request to get Room : {}", id);
        return roomRepository.findById(id);
    }

    /**
     * Delete the room by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Room : {}", id);
        roomRepository.deleteById(id);
    }
}
