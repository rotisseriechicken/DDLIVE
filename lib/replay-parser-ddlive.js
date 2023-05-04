'use strict';

DataView.prototype.getString = function(offset, length, encoding) {
  const buffer = new Uint8Array(this.buffer, offset, length);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
};

var replayParser_entityID = 1;

function streamOf(data) {
	const dataView = new DataView(data);
	let i = 0;
	return {
		setOffset: (ofs) => {
			dataView.byteOffset = ofs;
			return null;
		},
		readString: (ofs, len) => {
			return dataView.getString(ofs, len, 'utf-8');
		},
		readUInt8: () => {
			return dataView.getUint8(i++, true);
		},
		readInt16: () => {
			const x = dataView.getInt16(i, true);
			i += 2;
			return x;
		},
		readInt32: () => {
			const x = dataView.getInt32(i, true);
			i += 4;
			return x;
		},
		readFloat32: () => {
			const x = dataView.getFloat32(i, true);
			i += 4;
			return x;
		},
		readInt16Vec3: () => {
			const x = dataView.getInt16(i, true);
			i += 2;
			const y = dataView.getInt16(i, true);
			i += 2;
			const z = dataView.getInt16(i, true);
			i += 2;
			return {
				x: x,
				y: y,
				z: z,
			};
		},
		readFloat32Vec3: () => {
			const x = dataView.getFloat32(i, true);
			i += 4;
			const y = dataView.getFloat32(i, true);
			i += 4;
			const z = dataView.getFloat32(i, true);
			i += 4;
			return {
				x: x,
				y: y,
				z: z,
			};
		},
		readInt16Mat3x3: () => {
			const m11 = dataView.getInt16(i, true);
			i += 2;
			const m12 = dataView.getInt16(i, true);
			i += 2;
			const m13 = dataView.getInt16(i, true);
			i += 2;

			const m21 = dataView.getInt16(i, true);
			i += 2;
			const m22 = dataView.getInt16(i, true);
			i += 2;
			const m23 = dataView.getInt16(i, true);
			i += 2;

			const m31 = dataView.getInt16(i, true);
			i += 2;
			const m32 = dataView.getInt16(i, true);
			i += 2;
			const m33 = dataView.getInt16(i, true);
			i += 2;

			return {
				m11: m11,
				m12: m12,
				m13: m13,

				m21: m21,
				m22: m22,
				m23: m23,

				m31: m31,
				m32: m32,
				m33: m33,
			};
		},
		readFloat32Mat3x3: () => {
			const m11 = dataView.getFloat32(i, true);
			i += 4;
			const m12 = dataView.getFloat32(i, true);
			i += 4;
			const m13 = dataView.getFloat32(i, true);
			i += 4;

			const m21 = dataView.getFloat32(i, true);
			i += 4;
			const m22 = dataView.getFloat32(i, true);
			i += 4;
			const m23 = dataView.getFloat32(i, true);
			i += 4;

			const m31 = dataView.getFloat32(i, true);
			i += 4;
			const m32 = dataView.getFloat32(i, true);
			i += 4;
			const m33 = dataView.getFloat32(i, true);
			i += 4;

			return {
				m11: m11,
				m12: m12,
				m13: m13,

				m21: m21,
				m22: m22,
				m23: m23,

				m31: m31,
				m32: m32,
				m33: m33,
			};
		},
		seek: (count) => {
			i += count;
		},
		getOffset: () => i,
	};
}

function parseEntityPositionEvent(stream) {
	const event = {};
	event.type = 'entity_position';
	event.entityId = stream.readInt32();
	event.position = stream.readInt16Vec3();
	return event;
}

function parseEntityOrientationEvent(stream) {
	const event = {};
	event.type = 'entity_orientation';
	event.entityId = stream.readInt32();
	event.orientation = stream.readInt16Mat3x3();
	return event;
}

function parseEntityTargetEvent(stream) {
	const event = {};
	event.type = 'entity_target';
	event.entityId = stream.readInt32();
	event.targetPosition = stream.readInt16Vec3();
	return event;
}

function parseHitEvent(stream) {
	const event = {};
	event.type = 'hit';
	event.a = stream.readInt32();
	event.b = stream.readInt32();
	event.c = stream.readInt32();
	event.d = 0;

	if(Math.sign(event.a) == -1){
		event.d = 1; // This was a non weak spot hit on a pede, etc.
	}

	event.a = Math.abs(event.a);
	event.b = Math.abs(event.b);

	return event;
}

function parseTransmuteEvent(stream) {
	const event = {};
	event.type = 'transmute';
	event.entityId = stream.readInt32();
	event.a = stream.readInt16Vec3();
	event.b = stream.readInt16Vec3();
	event.c = stream.readInt16Vec3();
	event.d = stream.readInt16Vec3();
	return event;
}

function parseInputsEvent(stream, firstTick) {
	const event = {};
	event.type = 'inputs';
	event.left = stream.readUInt8();
	event.right = stream.readUInt8();
	event.forward = stream.readUInt8();
	event.backward = stream.readUInt8();
	event.jump = stream.readUInt8();
	event.shoot = stream.readUInt8();
	event.shootHoming = stream.readUInt8();
	event.mouseX = stream.readInt16();
	event.mouseY = stream.readInt16();
	if (firstTick) {
		event.lookSpeed = (500 / 3) * stream.readFloat32();
	}

	const end = stream.readUInt8();
	if (end != 0xa) {
		throw "invalid end of inputs frame " + end + ", " + 0xa + " was expected";
	}

	return event;
}

function parseSpawnEvent(stream) {
	const event = {};
	event.type = 'spawn';
	event.entityId = replayParser_entityID;
	replayParser_entityID++;

	const entityType = stream.readUInt8();
	switch (entityType) {
		case 0x01: return parseDaggerSpawnEvent(stream, event);
		case 0x03: return parseSquidSpawnEvent(stream, event, 'squid 1');
		case 0x04: return parseSquidSpawnEvent(stream, event, 'squid 2');
		case 0x05: return parseSquidSpawnEvent(stream, event, 'squid 3');
		case 0x06: return parseBoidSpawnEvent(stream, event);
		case 0x07: return parsePedeSpawnEvent(stream, event, 'centipede');
		case 0x0c: return parsePedeSpawnEvent(stream, event, 'gigapede');
		case 0x0f: return parsePedeSpawnEvent(stream, event, 'ghostpede');
		case 0x08: return parseSpiderSpawnEvent(stream, event, 'spider 1');
		case 0x09: return parseSpiderSpawnEvent(stream, event, 'spider 2');
		case 0x0a: return parseSpiderEggSpawnEvent(stream, event);
		case 0x0b: return parseLeviathanSpawnEvent(stream, event);
		case 0x0d: return parseThornSpawnEvent(stream, event);
		default: throw "unknown entity type: " + entityType;
	}
}

function parseDaggerSpawnEvent(stream, event) {
	event.entityType = 'dagger';
	event.a = stream.readInt32();
	event.position = stream.readInt16Vec3();
	event.orientation = stream.readInt16Mat3x3();
	event.shotgun = stream.readUInt8();
	event.daggerType = stream.readUInt8();
	return event;
}

function parseSquidSpawnEvent(stream, event, entityType) {
	event.entityType = entityType;
	event.a = stream.readInt32();
	event.position = stream.readFloat32Vec3();
	event.b = stream.readFloat32Vec3();
	event.rotationInRadians = stream.readFloat32();
	return event;
}

function parseBoidSpawnEvent(stream, event) {
	event.spawnerEntityId = stream.readInt32();

	const boidType = stream.readUInt8();
	switch (boidType) {
		case 0x01: event.entityType = 'skull 1'; break;
		case 0x02: event.entityType = 'skull 2'; break;
		case 0x03: event.entityType = 'skull 3'; break;
		case 0x04: event.entityType = 'spiderling'; break;
		case 0x05: event.entityType = 'skull 4'; break;
		default: throw 'invalid boid type ' + boidType;
	}

	event.position = stream.readInt16Vec3();
	event.a = stream.readInt16Vec3();
	event.b = stream.readInt16Vec3();
	event.c = stream.readInt16Vec3();
	event.d = stream.readFloat32Vec3();
	event.speed = stream.readFloat32();
	return event;
}

function parsePedeSpawnEvent(stream, event, entityType) {
	event.entityType = entityType;
	event.a = stream.readInt32();
	event.position = stream.readFloat32Vec3();
	event.b = stream.readFloat32Vec3();
	event.orientation = stream.readFloat32Mat3x3();
	return event;
}

function parseSpiderSpawnEvent(stream, event, entityType) {
	event.entityType = entityType;
	event.a = stream.readInt32();
	event.position = stream.readFloat32Vec3();
	event.position.x = event.position.x*16;
	event.position.y = event.position.y*12; // manual offset; should be 16
	event.position.z = event.position.z*16;
	return event;
}

function parseSpiderEggSpawnEvent(stream, event) {
	event.entityType = 'spider egg';
	event.spawnerEntityId = stream.readInt32();
	event.position = stream.readFloat32Vec3();
	event.targetPosition = stream.readFloat32Vec3();
	return event;
}

function parseLeviathanSpawnEvent(stream, event) {
	event.entityType = 'leviathan';
	event.a = stream.readInt32();
	return event;
}

function parseThornSpawnEvent(stream, event) {
	event.entityType = 'thorn';
	event.a = stream.readInt32();
	event.position = stream.readFloat32Vec3();
	event.rotation = stream.readFloat32(); // ...? -matt

	event.position.x = event.position.x*16;
	event.position.y = Math.abs(event.position.y*8); // manual offset; they spawn underground, *16 is correct
	event.position.z = event.position.z*16;

	return event;
}

function parseEvent(stream, firstTick) {
	const eventType = stream.readUInt8();
	switch (eventType) {
		case 0x00: return parseSpawnEvent(stream, replayParser_entityID);
		case 0x01: return parseEntityPositionEvent(stream);
		case 0x02: return parseEntityOrientationEvent(stream);
		case 0x04: return parseEntityTargetEvent(stream);
		case 0x05: return parseHitEvent(stream);
		case 0x06: return { type: 'gem' };
		case 0x07: return parseTransmuteEvent(stream);
		case 0x09: return parseInputsEvent(stream, firstTick);
		case 0x0b: return { type: 'end' };
		default: throw "unknown event type: " + eventType;
	}
}

function parseReplayEvents(uncompressedReplayEventsBuffer) {
	const events = [];
	let firstTick = true;
	replayParser_entityID = 1;

	const stream = streamOf(uncompressedReplayEventsBuffer);

	while (true) {
		const event = parseEvent(stream, firstTick, replayParser_entityID);
		events.push(event);

		if (event.type == 'inputs') {
			firstTick = false;
		}
		else if (event.type == 'end') {
			return events;
		}
	}
}

function extractCompressedReplayEventsBufferFromLocalReplay(localReplayBuffer) {
	const stream = streamOf(localReplayBuffer);

	// Skip first parts of the local replay header
	stream.seek(50);

	// Skip username
	const usernameLength = stream.readInt32();
	stream.seek(usernameLength);

	// Skip more header data
	stream.seek(26);

	// Skip spawnset
	const spawnsetLength = stream.readInt32();
	stream.seek(spawnsetLength);

	const compressedReplayEventsBufferLength = stream.readInt32();
	const offset = stream.getOffset();
	return localReplayBuffer.slice(offset, offset + compressedReplayEventsBufferLength);
}

function parseLocalReplayIntoEvents(localReplayBuffer) {
	const compressedReplayEventsBuffer = extractCompressedReplayEventsBufferFromLocalReplay(localReplayBuffer);
	const rawReplayEventsBuffer = pako.inflate(compressedReplayEventsBuffer).buffer;
	return parseReplayEvents(rawReplayEventsBuffer);
}

function extractCompressedReplayEventsBufferFromLeaderboardReplay(leaderboardReplayBuffer) {
	const stream = streamOf(leaderboardReplayBuffer);

	// Skip format identifier
	stream.seek(7);

	/*
		//	Skip username
		const usernameLength = stream.readInt16();
		stream.seek(usernameLength);
	*/

	// Get username
	const usernameLength = stream.readInt16();
	const usrOfs = stream.getOffset();
	const username = stream.readString(usrOfs, usernameLength);
	stream.seek(usernameLength);

	// Skip unknown buffer
	const unknownBufferLength = stream.readInt16();
	stream.seek(unknownBufferLength);

	const offset = stream.getOffset();
	return [leaderboardReplayBuffer.slice(offset), username];
}

function parseLeaderboardReplayIntoEvents(leaderboardReplayBuffer) {
	const compressedReplayEventsBuffer = extractCompressedReplayEventsBufferFromLeaderboardReplay(leaderboardReplayBuffer);
	const rawReplayEventsBuffer = pako.inflate(compressedReplayEventsBuffer[0]).buffer;
	const rawUsername = compressedReplayEventsBuffer[1];
	return [parseReplayEvents(rawReplayEventsBuffer), rawUsername];
}