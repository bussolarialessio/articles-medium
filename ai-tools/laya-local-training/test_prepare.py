import unittest
from prepare import split_rows


class SplitTests(unittest.TestCase):
    def row(self, state):
        return {"state": state, "questions": {"q": {"type": "noul", "instructions": "Keep this?"}}, "gold": {"q": True}}

    def test_duplicate_states_stay_in_one_partition(self):
        rows = [self.row(str(i)) for i in range(10)] * 2
        train, evaluation = split_rows(rows)
        self.assertFalse({r["state"] for r in train} & {r["state"] for r in evaluation})
        self.assertEqual(len(train) + len(evaluation), 20)
        self.assertEqual((train, evaluation), split_rows(rows))

    def test_too_few_groups_fail(self):
        for count in range(3):
            with self.assertRaises(ValueError):
                split_rows([self.row(str(i)) for i in range(count)])

    def test_unlabelled_data_fails(self):
        with self.assertRaises(ValueError):
            split_rows([{"state": "x", "questions": {}}])


if __name__ == "__main__":
    unittest.main()
